import { Action, Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Actions } from 'src/bot/constant/action';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Context, Markup } from 'telegraf';
import * as buttons from '../markup/buttons';

@Wizard('login')
class LoginScene {
  constructor(private userService: UserService) {}

  //   @Action(Actions.AGGRE_WITH_POLICY)
  //   async onPolicy(@Ctx() ctx: any) {
  //     console.log(1);
  //     await ctx.wizard.selectStep(6);
  //   }

  @WizardStep(1)
  async requestLastName(ctx: any) {
    ctx.replyWithHTML(
      'Введите, пожалуйста, свою <b>Фамилию</b>\n\n<b>Например: Иванов</b>',
      Markup.removeKeyboard(),
    );
    await ctx.wizard.next();
  }

  @WizardStep(2)
  async requestFirstName(ctx: any) {
    if (!ctx.message) await ctx.scene.reenter();
    if (ctx.message.text == Actions.BACK) await ctx.scene.reenter();
    ctx.wizard.state.last_name = ctx.message.text;
    ctx.wizard.state.nuckname = ctx.message.from?.username;

    ctx.replyWithHTML(
      'Отлично, теперь введите своё <b>Имя</b>\n\n<b>Например: Иван</b>',
    );
    await ctx.wizard.next();
  }

  @WizardStep(3)
  async requestCity(ctx: any) {
    if (!ctx.message) await ctx.scene.reenter();
    if (ctx.message.text == Actions.BACK) await ctx.scene.reenter();
    ctx.wizard.state.first_name = ctx.message.text;

    ctx.replyWithHTML(
      'Отлично, теперь введите откуда вы\n\n<b>Например: Москва</b>',
    );
    await ctx.wizard.next();
  }

  @WizardStep(4)
  async requestPhone(ctx: any) {
    if (!ctx.message) await ctx.scene.reenter();
    if (ctx.message.text == Actions.BACK) await ctx.scene.reenter();
    ctx.wizard.state.city = ctx.message.text;

    ctx.replyWithHTML(
      `👋 Привет, ${ctx.wizard.state.first_name}.\nДля начала работы с ботом тебе необходимо авторизоваться через номер телефона. Для этого впишите его сообщением\n<b>В формате:</b> +71234567890`,
    );

    await ctx.wizard.next();
  }

  @WizardStep(5)
  async requestPolicy(ctx: any) {
    if (!ctx.message) await ctx.scene.reenter();
    if (ctx.message.text == Actions.BACK) await ctx.scene.reenter();

    ctx.wizard.state.checkNumber = ctx.message.text;

    ctx.wizard.state.phone =
      ctx.wizard.state.checkNumber.indexOf('+') == -1
        ? (ctx.wizard.state.phone = '+' + ctx.wizard.state.checkNumber)
        : (ctx.wizard.state.phone = ctx.wizard.state.checkNumber);

    const isPhoneValide = await this.userService.phoneSchema.isValid(
      ctx.wizard.state.phone,
    );

    if (!isPhoneValide) {
      ctx.replyWithHTML(
        '<b>Error</b>: некорректный номер телефона\n<b>Пример:</b> +71234567890',
      );
      ctx.wizard.selectStep(4);
    } else {
      ctx.replyWithHTML(
        `Нажимая кнопку «отправить заявку», Вы даете согласие на обработку Ваших персональных данных.\nССылка на документ: https://soak-pods.ru/politika.pdf`,
        buttons.REQUEST_POLICY(),
      );
    }
  }

  @Action(Actions.AGGRE_WITH_POLICY)
  async saveUser1(ctx: any) {
    ctx.editMessageText(
      'Согласие на обработку персональных данных получено ✅',
    );

    const isPhoneValide = await this.userService.phoneSchema.isValid(
      ctx.wizard.state.phone,
    );
    if (isPhoneValide) {
      let phone = ctx.wizard.state.phone;
      phone = Number(phone.slice(1, 12));

      const user = await this.userService.findUser(phone);

      if (!user) {
        const newUser = {
          chatId: ctx.chat.id,
          username: ctx.wizard.state.username || 'blocked',
          first_name: ctx.wizard.state.first_name,
          last_name: ctx.wizard.state.last_name,
          phone: String(phone),
          city: ctx.wizard.state.city,
        } as CreateUserDto;

        await this.userService.saveUser(newUser);
        await ctx.replyWithHTML(
          'Привет! Меня зовут <b>Паффи</b>.\nРад знакомству😌\n\nЗдесь ты можешь найти ближайшую точку продажи товаров от SOAK, а также ознакомиться с актуальными розыгрышами нашей компании',
          buttons.MAIN_MENU(),
        );

        await ctx.scene.leave();
        return;
      }

      const isAdmin = await this.userService.findAdminByChatId(user);

      if (isAdmin) {
        await ctx.reply('Приветствую, админ.\nДоступ к приложению открыт');
        await ctx.scene.leave();
        return;
      }

      await ctx.replyWithHTML(
        'Привет! Меня зовут <b>Паффи</b>.\nРад знакомству😌\n\nЗдесь ты можешь найти ближайшую точку продажи товаров от SOAK, а также ознакомиться с актуальными розыгрышами нашей компании',
        buttons.MAIN_MENU(),
      );

      return ctx.scene.leave();
    } else {
      ctx.replyWithHTML(
        '<b>Error</b>: некорректный номер телефона\n<b>Пример:</b> +71234567890',
      );
    }
  }
}

export default LoginScene;
