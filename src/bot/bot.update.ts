import { Controller } from '@nestjs/common';
import {
  Ctx,
  InjectBot,
  On,
  Start,
  Update,
  Action,
  Hears,
} from 'nestjs-telegraf';
import { Context } from './interfaces/context.interface';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

import { UserService } from 'src/user/user.service';

import * as buttons from './markup/buttons';
import {
  Actions,
  QuestAnswers,
  Wholesale_Cooperation,
} from './constant/action';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot('soakcare_bot') private readonly bot: Telegraf<Context>,
    private readonly userService: UserService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    try {
      const isUser = await this.userService.findUserByChatId(ctx.chat.id);
      if (isUser) {
        await ctx.replyWithHTML(
          'Привет! Меня зовут <b>Паффи</b>.\nРад знакомству😌\n\nЗдесь ты можешь найти ближайшую точку продажи товаров от SOAK, а также ознакомиться с актуальными розыгрышами нашей компании',
          buttons.MAIN_MENU(),
        );
        return;
      }
      await ctx.scene.enter('login');
    } catch (error) {
      console.log(error);
    }
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    console.log((ctx.message as Message.PhotoMessage).photo);
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context) {
    console.log((ctx.message as Message.VideoMessage).video);
  }

  // ================= Buttons Level 1 =======================
  @Action(Actions.QA)
  async qa(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Вопросы и ответы на часто задаваемые вопросы',
      buttons.QA(),
    );
  }

  @Action(Actions.BREAKDOWN)
  async breakdown(@Ctx() ctx: Context) {
    ctx.editMessageText('Проблема с работой устройства', buttons.BREAKDOWN());
  }

  @Action(Actions.WHOLESALE_AND_COOPERATION)
  async wholesale(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Опт и сотрудничество',
      buttons.WHOLESALE_AND_COOPERATION(),
    );
  }

  @Action(Actions.CONNECT_TO_HR)
  async hr(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Напишите на какую вакансию откликаетесь данному человеку @hr_anna_soak_pods1',
      buttons.BACK(),
    );
  }

  @Action(Actions.CONNECT_TO_MARKETING)
  async marketing(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Напишите ваше предложение или сотрудничество данному человеку @las_soak',
      buttons.BACK(),
    );
  }

  // ================= Buttons Level 2 =======================
  // QA
  @Action(QuestAnswers.SHOP_PRICE)
  async prices(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Все цены являются <b>рекомендованной розничной ценой</b>\nЦена может <b>меняться</b> в зависимости региона\n\n- SOAK X 1500 тяг - <b>650р</b>\n- SOAK ZERO X 1500 - <b>650р</b>\n- SOAK S 2500 - <b>800р</b>\n- SOAK M 4000 - <b>1100р</b>\n- SOAK L жидкость - <b>750р</b>\n- SOAK Q 1500 тяг - <b>1000р</b>.\n- Q картридж в упаковке 1 шт - <b>450р</b>.\n- Q картридж в упаковке 2 шт - <b>800р.</b>',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Actions.BACK,
                callback_data: Actions.BACK + 'qa_lvl_1',
              },
            ],
          ],
        },
      },
    );
  }
  @Action(QuestAnswers.SHOP_LOCATION)
  async locations(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Пройдите по нашему хештегу и выберите нужный город, узнать по наличию товара звоните заранее сам в магазин\n\n<b>#SOAKВТВОЕМГОРОДЕ</b>',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Actions.BACK,
                callback_data: Actions.BACK + 'qa_lvl_1',
              },
            ],
          ],
        },
      },
    );
  }
  @Action(QuestAnswers.SHOP_LOCATION_NONE)
  async locations_none(@Ctx() ctx: Context) {
    ctx.editMessageText('Cвязаться с оператором, напишите нужный город', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: Actions.BACK,
              callback_data: Actions.BACK + 'qa_lvl_1',
            },
          ],
        ],
      },
    });
  }
  @Action(QuestAnswers.SHOP_ORIGINAL)
  async original(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Добрый день, на упаковке есть Qr\n\nНаводите камеру, вас отправляет на сайт проверки, <b>нажимаете «ПОДТВЕРДИТЬ ЗАПРОС»</b> и читаете результат. Дважды проверить не получится.',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Actions.BACK,
                callback_data: Actions.BACK + 'qa_lvl_1',
              },
            ],
          ],
        },
      },
    );
  }
  @Action(QuestAnswers.SHOP_NAMING)
  async naming(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'На сегодняшний день вся жидкость называется L, до этого она называлась LX, LS.\n\n(LX - вкусы повторяются из линейки Х на 1500 тяг.\nLS – вкусы повторяются из линейки S на 2500 тяг)',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Actions.BACK,
                callback_data: Actions.BACK + 'qa_lvl_1',
              },
            ],
          ],
        },
      },
    );
  }

  // Breakdown
  @Action('product')
  async product(@Ctx() ctx: Context) {
    ctx.editMessageText(
      'Добрый день, опишите проблему. И подскажите, где покупали:\n\n- Город\n- Адрес агазина\n- Название магазина\n- Вкус\n- Скрин оплаты (электронный чек)  фото бумажного чека\n- Видео или фото проблемы',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Actions.BACK,
                callback_data: Actions.BACK + 'breakdown_lvl_1',
              },
            ],
          ],
        },
      },
    );
  }

  // Wholesale
  @Action(Wholesale_Cooperation.VOLUME_WHOLESALE)
  @Action(Wholesale_Cooperation.VIEW_PRICE)
  @Action(Wholesale_Cooperation.VIEW_CONTACT)
  async volume(@Ctx() ctx: Context) {
    ctx.editMessageText('Связаться с оператором', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: Actions.BACK,
              callback_data: Actions.BACK + 'wholesale_lvl_1',
            },
          ],
        ],
      },
    });
  }

  @Action([
    Actions.BACK + 'qa_lvl_1',
    Actions.BACK + 'breakdown_lvl_1',
    Actions.BACK + 'wholesale_lvl_1',
    Actions.BACK + '_lvl_1',
    Actions.BACK + '_lvl_2',
    Actions.BACK + '_lvl_3',
  ])
  async onBack(@Ctx() ctx: any) {
    const cb: string = ctx.callbackQuery.data;

    if (cb.includes('wholesale')) {
      ctx.editMessageText(
        'Опт и сотрудничество ',
        buttons.WHOLESALE_AND_COOPERATION(),
      );
      return;
    }

    if (cb.includes('breakdown')) {
      ctx.editMessageText(
        'Проблема с работой устройства ',
        buttons.BREAKDOWN(),
      );
      return;
    }

    if (cb.includes('qa')) {
      ctx.editMessageText(
        'Вопросы и ответы на часто задаваемые вопросы ',
        buttons.QA(),
      );
      return;
    }

    if (cb.includes('1')) {
      ctx.editMessageText(
        'Привет! Меня зовут Паффи.\nРад знакомству😌\n\nЗдесь ты можешь найти ближайшую точку продажи товаров от SOAK, а также ознакомиться с актуальными розыгрышами нашей компании',
        buttons.MAIN_MENU(),
      );
      return;
    }
  }
}
