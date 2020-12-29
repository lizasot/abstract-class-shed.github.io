// ==UserScript==
// @name         CW: Shed
// @version      1.5.37
// @description  Сборник небольших дополнений к игре CatWar
// @author       ReiReiRei
// @copyright    2020, Ленивый (https://catwar.su/cat930302)
// @license      MIT; https://opensource.org/licenses/MIT
// @updateURL    https://openuserjs.org/meta/ReiReiRei/CW_Shed.meta.js
// @include      /https:\/\/\w?\.?catwar\.su\/.*/
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// ==/UserScript==
/*global jQuery*/
(function (window, document, $) {
  'use strict';
  if (typeof $ === 'undefined') return;
  const version = '1.5.37';
  /*
  1.5.37
  Добавлены титульники ачивкам Реки и вдобавок инфоблок к ним (пыталась сделать в стиле Варомода, чтоб не выбивалось из общей темы)
  todo: сомята
  */
  //Настройки + умолчания глобальные
  const isDesktop = !$('meta[name=viewport]').length;
  const defaults = {
'on_actNotif' : false // Уведомления на действия
, 'on_newDM' : false // уведомления на новые лс
, 'on_newChat' : false // уведомления на новое соо в чате (не игровой)
, 'on_chatMention' : false // уведомления на упоминание имени в чате
, 'on_blockNotif' : false // уведомления при нажатии/отжатии блока
, 'on_smellTimerNotif' : true // уведомление при окончании таймера нюха
, 'on_paramInfo' : true // Информация о параметрах при нажатии
, 'on_idDM' : true // Включены по умолчанию: ID в личных сообщениях
, 'on_idCatMouth' : true // ID котов во рту при выборе
, 'on_idItemMouth' : true // ID предметов (и уникальные, и обычные) + инфо
, 'on_idChat' : false // ID в чате Игровой
, 'on_teamFights' : false // Команды в боережиме
, 'on_huntText' : true // Охота с текстом движения дичи
, 'on_huntMobileBtns' : true // Стиль, добавляющий кнопки охоте на телефонах
, 'on_huntMobileFix' : false // Стиль, фиксящий охоту на телефонах
, 'on_cleanerHistory' : false // лог чистки
, 'on_charChange' : false // список персонажей
, 'on_catsDown' : false // коты внизу клетки
, 'on_nickHighlight' : false // подсвечивание (кастомных) имен в чате
, 'on_moveFightLog' : false // кнопка (и возможность) перемещения лога бр
, 'on_shortFightLog' : false // сокращение лога бр
, 'on_reports' : false // отчеты в блогах
, 'on_oldDialogue' : false // старый вид диалогов (1 колонка в выборе)
, 'on_smellTimer' : false // таймер нюха
, 'on_cuMovesNote' : true // Окно заметок для ВТ
 //Громкость звуков
, 'sound_notifEaten' : 0.2 // Звук, когда тебя подняли
, 'sound_notifBeaten' : 0.2 // Звук, когда тебя атакуют
, 'sound_notifEndAct' : 0.1 // Звук, когда заканчивается действие
, 'sound_newDM' : 0.1 // Звук при получении ЛС
, 'sound_newChat' : 0.1 // Звук при получении соо в Чате
, 'sound_chatMention' : 0.3 // Звук при упоминании имени игрока в чате (жёлтым)
, 'sound_blockStart' : 0.1 // Звук при нажатии блока
, 'sound_blockEnd' : 0.1 // Звук при отжатии блока
, 'sound_ttRefresh' : 0.2 // Звук при смене карты
, 'sound_smellTimer' : 0.1 // Звук при окончании таймера нюха
 //Настройки лога чистки
, 'clean_id' : true // Писать в логе ID поднятого
, 'clean_title' : true // Писать в логе должность поднятого
, 'clean_location' : true // Писать в логе локацию, где подняли и где отпустили
, 'clean_action' : false // Писать в логе проверку на действие
 //Массивы
, 'charListArray' : [] //Список персонажей игрока в игровой
, 'cm_blocked' : [] //Список игроков, от которых не получать уведомления на упоминание в чате
, 'nickListArray' : [] //Список ников игрока
 //Настройки команд в БР
, 'tf_max_height' : 100 // макс высота блока с командами
, 'fight_log_max_height' : 70 // высота лога бр
, 'tf_color_g_team1' : "#41cd70" // зелёный цвет команды 1 (основная) в командах бр
, 'tf_color_g_team2' : "#429dde" // зелёный цвет команды 2 в командах бр
, 'tf_color_g_team3' : "#f6c739" // зелёный цвет команды 3 в командах бр
, 'tf_color_g_team4' : "#ee91d7" // зелёный цвет команды 4 в командах бр
, 'tf_color_r_team1' : "#cd4141" // красный цвет команды 1 (основная) в командах бр
, 'tf_color_r_team2' : "#cd4141" // красный цвет команды 2 в командах бр
, 'tf_color_r_team3' : "#cd4141" // красный цвет команды 3 в командах бр
, 'tf_color_r_team4' : "#cd4141" // красный цвет команды 4 в командах бр
 //Умолчания действий (УВЕДОМЛЕНИЯ)
, 'notif_eaten' : true // Уведомлять, когда тебя съели
, 'notif_attack' : false // Уведомлять, когда тебя ввели в БР через Т2/Т3
 //Умолчания действий - ЗВУК
, 'snd_act_move' : true // Переход
, 'snd_act_eat' : false // Еда
, 'snd_act_need' : true // Нужда
, 'snd_act_drink' : true // Жажда
, 'snd_act_dig' : true // Копать
, 'snd_act_sleep' : true // Спать
, 'snd_act_sniff' : true // Нюхать
, 'snd_act_digin' : true // Закапывать
, 'snd_act_clean' : true // Вылизывать(ся)
, 'snd_act_swim' : true // Поплавать
, 'snd_act_fill_moss' : true // Наполнить водой мох
, 'snd_act_murr' : true // Помурлыкать
, 'snd_act_tails' : false // Переплести хвосты
, 'snd_act_cheek' : false // Потереться щекой о щёку
, 'snd_act_ground' : false // Повалять по земле
, 'snd_act_rub' : false // Потереться носом о нос
, 'snd_act_calm' : false // Выход из бр
, 'snd_act_watch' : true // Осматривать окрестности
, 'snd_act_marking' : false // Метить территорию
, 'snd_act_clawscratch' : false // Точить когти
, 'snd_act_rug' : false // Чистить ковёр
, 'snd_act_attention' : false // Привлекать внимание
, 'snd_act_domestsleep' : false // Сон в лежанке
, 'snd_act_checkup' : false // Осмотреть кота
, 'snd_act_loottr' : true // осмотреть дупло
, 'snd_act_lootcr' : true // осмотреть расщелину
 //Умолчания действий - ТЕКСТ
, 'txt_act_move' : true // Переход
, 'txt_act_eat' : true // Еда
, 'txt_act_need' : true // Нужда
, 'txt_act_drink' : true // Жажда
, 'txt_act_dig' : true // Копать
, 'txt_act_sleep' : true // Спать
, 'txt_act_sniff' : true // Нюхать
, 'txt_act_digin' : true // Закапывать
, 'txt_act_clean' : true // Вылизывать(ся)
, 'txt_act_swim' : true // Поплавать
, 'txt_act_fill_moss' : true // Наполнить водой мох
, 'txt_act_murr' : true // Помурлыкать
, 'txt_act_tails' : true // Переплести хвосты
, 'txt_act_cheek' : true // Потереться щекой о щёку
, 'txt_act_ground' : true // Повалять по земле
, 'txt_act_rub' : true // Потереться носом о нос
, 'txt_act_calm' : true // Выход из бр
, 'txt_act_watch' : true // Осматривать окрестности
, 'txt_act_marking' : true // Метить территорию
, 'txt_act_clawscratch' : true // Точить когти
, 'txt_act_rug' : true // Чистить ковёр
, 'txt_act_attention' : true // Привлекать внимание
, 'txt_act_domestsleep' : true // Сон в лежанке
, 'txt_act_checkup' : true // Осмотреть кота
, 'txt_act_loottr' : true // осмотреть дупло
, 'txt_act_lootcr' : true // осмотреть расщелину
, 'my_id' : '' // Айди для отчетов
 //Минное поле
, 'on_treeTechies' : false // минное поле
, 'tt_folded' : false // сворачивать минное поле
, 'tt_dark_theme' : false // темная тема
, 'tt_show_volume' : true // показывать громкость веток в чате
, 'tt_clean_confirm' : true // подтверждение очистки
, 'tt_notif_refresh' : false // звук при обновлении локи
, 'tt_window_top' : 20 // положение окна относительно верхней части
, 'tt_window_left' : 20 // положение окна относительно левой части
, 'tt_pagenamesArray' : ['1А', '2А', '3А', '4А', '5А', '6А', '1Б', '2Б', '3Б', '4Б', '5Б', '6Б', '1В', '2В', '3В', '4В', '5В', '6В', '1Г', '2Г', '3Г', '4Г', '5Г', '6Г'] //Список названий
, 'tt_pageenabledArray' : [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] //Список включенных , страниц
, 'tt_foldersnamesArray' : ['А', 'Б', 'В', 'Г'] //имена вкладок
, 'tt_foldersenabledArray' : [true, true, true, true] //включение вкладок
 //CSS
, 'on_css_quicksettings' : false // быстрые настройки
, 'on_csslocation' : false // замена фона на определенный
, 'on_css_removesky' : false // убрать небо
, 'on_css_oldicons' : false // старые иконки
, 'on_css_coloredparam' : false // цветные параметры и навыки
, 'on_css_cellshade' : false // сетка
, 'on_css_bgpic' : false // картинка на заднем фоне
, 'on_css_highlightmove' : false // подсветка переходов при наведении
, 'on_css_maxopacity' : false // непрозрачные мертвецы
, 'on_css_newloading' : false // замена гифки загрузки
, 'on_css_hideTooltip' : false // скрыть табличку (для кача лу)
, 'on_css_daylight' : false // всегда день
, 'css_bgpicURL' : 'https://catwar.su/cw3/spacoj/0.jpg' // картинка на заднем плане игровой
, 'css_locURL' : 'https://catwar.su/cw3/spacoj/170.jpg' // на какой фон заменять
, 'css_cellshadeColor' : '#ffffff' // сетка цвет
, 'css_cellshadeOpacity' : 0.1 // сетка прозрачность
, 'css_theme' : 'theme_classic' // тема
, 'css_cp_pattern' : true // узор в навыках и параметрах
, 'css_cp_colors' : ['#ac23bf', '#d860ea', '#5e1268', '#6f2f79', '#dfab04', '#f0d142', '#845406', '#886921', '#28afd0', '#2bedee', '#165f75', '#157a7d', '#51d74c', '#89df4b', '#327327', '#54842d', '#d22c28', '#ee8761', '#841921', '#913733', '#a65b32', '#f09662', '#62351c', '#804c2d', '#379034', '#51bb39', '#1b4d1b', '#336b24'] // цвета
  };
  const globals = {}; //Настройки
  for (var key in defaults) {
      let settings = getSettings(key);
      if (settings === null) {
          globals[key] = defaults[key];
      } else {
          if (Array.isArray(defaults[key])) {
              globals[key] = JSON.parse(settings);
          }
          else {
              globals[key] = settings;
          }
      }
  }
  const sounds = {};
  sounds.new_message = 'https://catwar.su/new_message.mp3';
  sounds.action_notif = 'https://abstract-shed.site/cwm_catalog/action_end.mp3';
  sounds.chat_mention = 'https://abstract-shed.site/cwm_catalog/chat_mention.mp3';
  sounds.alert_attacked = 'https://d.zaix.ru/ihrv.mp3';
  sounds.tt_refresh = 'https://abstract-shed.site/cwm_catalog/refresh.wav'; //изменить потом
  sounds.block_start = 'https://abstract-shed.site/cwm_catalog/lock.mp3';
  sounds.block_end = 'https://abstract-shed.site/cwm_catalog/unlock.mp3';

  function playAudio(src, vlm) {
    let audio = new Audio();
    audio.src = src;
    audio.volume = vlm;
    audio.play();
  }

  function getSettings(key) { //Получение настроек
    let setting = 'cws_sett_' + key;
    let val = window.localStorage.getItem(setting);
    switch (val) {
      case null:
        return null;
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return val;
    }
  }
  var error_tm;

  function error(t) {
    $("#error").text(t).show();
    clearTimeout(error_tm);
    error_tm = setTimeout(function () {
      hideError()
    }, 10000);
  }

  function hideError() {
    clearTimeout(error_tm);
    $("#error").fadeOut(500);
  }

  function setSettings(key, val) {
    let setting = 'cws_sett_' + key;
    window.localStorage.setItem(setting, val);
  }

  function removeSettings(key) {
    let setting = 'cws_sett_' + key;
    window.localStorage.removeItem(setting);
  }

  function addCSS(css) {
    $('head').append(`<style>${css}</style>`);
  }

  function leadZero(num) {
    return (num < 10) ? '0' + num : num;
  }
  const pageurl = window.location.href;
  const isCW3 = (/^https:\/\/\w?\.?catwar.su\/cw3(?!(\/kns|\/jagd))/.test(pageurl));
  const isDM = (/^https:\/\/\w?\.?catwar.su\/ls/.test(pageurl));
  const isHunt = (/^https:\/\/\w?\.?catwar.su\/cw3\/jagd/.test(pageurl));
  const isSett = (/^https:\/\/\w?\.?catwar.su\/settings/.test(pageurl));
  const isMyCat = (/^https:\/\/\w?\.?catwar.su\/$/.test(pageurl));
  const isBlog = (/^https:\/\/\w?\.?catwar.su\/blog\d+/.test(pageurl));
  const isCUMoves = (/^https:\/\/\w?\.?catwar.su\/moves$/.test(pageurl));
  const isProfile = (/^https:\/\/\w?\.?catwar.su\/cat(\d+|\/)/.test(pageurl));

  try {
    if (isCW3) cw3();
    if (isDM) dm();
    if (isSett) sett();
    if (isHunt) hunt();
    if (isMyCat) myCat();
    if (isBlog) blog();
    if (isProfile) profile();
    if (isCUMoves) cumoves();
  }
  catch (err) {
    window.console.error('CW:Shed error: ', err);
  }

  function cw3() { //Игровая
    $('#itemList').ready(function () { //Чинит осмотр расщелины, пока не сделают картинку
      let missActFlag = true;
      if (missActFlag) {
        $.ajax({
          url: 'actions/60.png',
          type: 'HEAD',
          error: function () {
            $('head').append(`<style>[data-id='60']>img {content:url(actions/59.png);</style>`);
            missActFlag = false;
          }
        });
      }
    /*function setItemListSort() {
    if ($('#itemList').length) {
      $( "#itemList" ).sortable();
        clearInterval(setItemListSort);
        }
    }
    setInterval(setItemListSort, 1000);*/
    });
    $('.small').first().append(` | <a href="/settings">Настройки модов</a>`); //Настройки мода
    if (globals.on_smellTimer) {
      $(document).ready(function () {
        $('.small').first().append(` | Нюх через: <span id="cws_smell_timer" value=0>0 с</span>`);
        let smellActive = 0;
        let smellOtherActive = 0;
        let firstNote = "";
        let rang = true;

        function smellTimerTick() {
          let val = parseInt($('#cws_smell_timer').attr('value'));
          if (val) {
            rang = false;
            val--;
            $('#cws_smell_timer').attr('value', val);
            let str = '';
            let hr = parseInt(val / 3600);
            let mi = parseInt((val - hr * 3600) / 60);
            let se = parseInt(val - (hr * 3600 + mi * 60));
            str += (hr) ? hr + ' ч ' : '';
            str += (mi || hr) ? mi + ' мин ' : '';
            str += se + ' с';
            $('#cws_smell_timer').html(str.trim());
          }
          else if (globals.on_smellTimerNotif && !rang) {
            playAudio(sounds.action_notif, globals.sound_smellTimer);
            rang = true;
          }
        }
        setInterval(smellTimerTick, 1000);
        //TODO: сделать так, чтоб таймер не запускался вообще, пока есть действие нюха, т.е. value != 0
        let firstClick = setInterval(function () { //господи я ненавижу варовскую привычку сначала создавать элемент <!----> а потом вставлять в него данные
          if ($('#smell_icon').length) {
            firstNote = $('#error').html();
            $('#smell_icon').click();
            clearInterval(firstClick);
          }
        }, 500);

        $("body").on('DOMNodeInserted', '#dein', 'a[data-id=14]', function () {
          let isActive = $('#dein a[data-id=14]').length;
          if (!smellOtherActive && isActive) { //Отменено действие нюха
            $('#cws_smell_timer').attr('value', 0);
            $('#cws_smell_timer').html('0 с');
          }
          smellOtherActive = isActive;
        });
        $("body").on('DOMNodeRemoved', '#dein', 'a[data-id=14]', function () {
          let isActive = $('#dein a[data-id=14]').length;
          if (smellOtherActive && !isActive) { //Нажато действие нюха
            $('#cws_smell_timer').attr('value', 3600);
            $('#cws_smell_timer').html('1 ч 0 мин 0 с');
          }
          smellOtherActive = isActive;
        });

        $("body").on('DOMSubtreeModified', '#error', function () {
          let html = $(this).html();
          if (html && html.indexOf('Следующее обнюхивание') !== -1) {
            let text = html.replace('Следующее обнюхивание будет доступно через ', '');
            let smellMin = (text.match(/(\d+) мин/g) == null) ? 0 : parseInt(text.match(/(\d+) мин/g)[0].replace(/\D/g, ''));
            let smellSec = parseInt(text.match(/(\d+) с/g)[0].replace(/\D/g, ''));
            let totalSec = smellMin * 60 + smellSec;
            $('#cws_smell_timer').attr('value', totalSec);
            $('#cws_smell_timer').html(smellMin + ' мин ' + smellSec + ' с');
            if (firstNote !== "") { //Чтоб не перекрывало уведомления о ранах, голоде и т.д.
              $('#error').html(firstNote);
              firstNote = "";
            }
          }
          else if (html.indexOf('Час уже прошёл') !== -1 && firstNote !== "") {
            $('#error').html(firstNote);
            firstNote = "";
          }
        });
      });
    }
    if (globals.on_oldDialogue) {
      $(document).ready(function () {
        $("body").on('DOMNodeInserted', '#text', function () {
          $(this).attr('size', 1);
        });
      });
    }
    if (globals.on_catsDown) { //опускаем котов вниз вместе со стрелами
      $(document).ready(function () {
        $('head').append(`<style>
.d, .d div {
  background-position: left bottom;
}
.catWithArrow {
  display: flex;
  flex-direction: column;
}
.catWithArrow > .cat {
  order: -1;
}
.catWithArrow > div {
  top: 10px;
}
.mouth {
  max-width: 160px;
}</style>`);
        $("body").on('DOMSubtreeModified DOMNodeInserted', '.catWithArrow', function (e) {
          let $arrow = $(this).find('.arrow');
          let topval = $arrow.css('top');
          if (topval) {
            let int_topval = parseInt(topval.replace('px', ''));
            if (int_topval > 0) {
              $arrow.css('bottom', topval);
              $arrow.css('top', '');
            }
          }
        });
      });
    }
    if (globals.on_charChange && globals.charListArray.length) {
      let CCArray = [];
      $.each(globals.charListArray, function (index, obj) {
        CCArray.push(`<a href="/login2?id=${obj.id}">${obj.name}</a>`);
      });
      $('.small').first().append(` | Персонажи: <span style="background: rgba(255, 255, 255, 0.25);">${CCArray.join(' | ')} </span>`);
    }
    if (globals.on_newDM) {
      let newDM = 0;
      $('body').on('DOMSubtreeModified', '#newls', function () {
        let newDMtmp = $(this).html();
        if (newDMtmp !== undefined) {
          newDMtmp = (newDMtmp === '') ? 0 : parseInt(newDMtmp.replace(/\D/gi, ''));
          if (newDMtmp > newDM) {
            playAudio(sounds.new_message, globals.sound_newDM);
          }
          newDM = newDMtmp;
        }
      });
    }
    if (globals.on_newChat) {
      let newChat = 0;
      $('body').on('DOMSubtreeModified', '#newchat', function () {
        let newChattmp = $(this).html();
        if (newChattmp !== undefined) {
          newChattmp = (newChattmp === '') ? 0 : parseInt(newChattmp.replace(/\D/gi, ''));
          if (newChattmp > newChat) {
            playAudio(sounds.new_message, globals.sound_newChat);
          }
          newChat = newChattmp;
        }
      });
    }
    if (globals.on_chatMention || globals.on_nickHighlight) {
      let myname_count = 0;
      $(document).ready(function () {
        $("#chat_msg").on('DOMNodeInserted', function (e) {
          if (e.target.children !== undefined && e.target.children.length == 2) {
            if (globals.on_nickHighlight) {
              $('#chat_msg .chat_text > span:first-child').each(function () {
                let html = $(this).html();
                let changed = false;
                $.each(globals.nickListArray, function (index, key) {
                  let expr = new RegExp('^(' + key + ')[^А-ЯЁёA-Za-z0-9]|[^А-ЯЁёA-Za-z0-9>](' + key + ')[^А-ЯЁёA-Za-z0-9<]|[^А-ЯЁёA-Za-z0-9](' + key + ')$|^(' + key + ')$', "ig");
                  if (html.match(expr)) { //есть имя и оно ещё не внутри тега
                    changed = true;
                    let matchAll = html.matchAll(expr);
                    matchAll = Array.from(matchAll); // теперь массив
                    $.each(matchAll, function (index, value) {
                      let replacer = value[1] || value[2] || value[3] || value[4]; //То, что было найдено
                      html = html.replace(value[0], value[0].replace(replacer, '<span class=myname>' + replacer + '</span>'));
                    });
                  }
                });
                if (changed) $(this).html(html);
              });
            }
            if (globals.on_chatMention) {
              //console.log("Количество упоминаний имени: " + myname_count);
              //console.log("Количество сообщений в чате: " + $('.chat_text').length);
              if (myname_count < $('.myname').length) {
                myname_count = $('.myname').length;
                console.log("Количество упоминаний имени теперь: " + myname_count);
                let caller = $('.myname').first().closest('tr').find('td:last-child a:first-child').attr('href') || 0;
                caller = parseInt(caller.replace(/\D/g, ''));
                let is_bot = $('.myname').first().closest('tr').find('i').length;
                console.log("Айди зовущего " + caller);
                //console.log("Это бот? " + is_bot);
                if (jQuery.inArray(caller, globals.cm_blocked) == -1 && !is_bot) { //ЕСЛИ НЕ В МАССИВЕ ИГНОРИРУЕМЫХ и не бот
                  console.log("Услышано имя: " + $(this).find('.chat_text > span').html());
                  playAudio(sounds.chat_mention, globals.sound_chatMention);
                }
              }
            }
          }
        });
      });
    }
    if (globals.on_idChat) { //Включена опция
      let i_chat = 0;
      let myname_count = $('.myname').length;
      $(document).ready(function () { // ДОБАВЛЕНИЕ АЙДИ ПОСЛЕ ИМЕН В ЧАТЕ ИГРОВОЙ
        $("#chat_msg").on('DOMNodeInserted', function (e) {
          if (e.target.children !== undefined && e.target.children.length == 2) {
            if (i_chat != $('#chat_msg > span').length) {
              $('#chat_msg > span').each(function () {
                let id = "[" + $(this).find('a[href*="/cat"]').attr('href').slice(4) + "]";
                if (!$(this).find('.mod_id').length && !$(this).hasClass('mod_id')) { //Если надписи еще нет (второе для ботов, т.к. там b ник + span кому говорит .nick:not([style*='italic'])
                  $(`<span class=mod_id_wrap> <i class=mod_id>${id}</i></span>`).insertAfter($(this).find('.nick:not([style*="italic"])'));
                  //только на последнее сообщение / сгенерированные при загрузке стр/локи / не "молчаливый" бот
                }
                else if ($(this).find('.mod_id').html() !== (id)) {
                  if ($(this).find('.nick[style*="italic"]').length) { //не "молчаливый" бот
                    id = "";
                  }
                  $(this).find('.mod_id').html(id);
                }
              });
            }
            i_chat = $('#chat_msg > span').length; //Убирает дубли, потому что система добавления нового сообщения на варе очень хорошая
          }
        });
      });
    }
    if (globals.on_idItemMouth) {
      let item_names_json = {};
      $.post("https://abstract-shed.site/cwm_catalog/item_names.json?" + Date.now(), {}, function (response) { //Подгрузка имен предметов из json файла с сервера сайта
        item_names_json = response;
      });
      $(document).ready(function () {
        $("#thdey > ul").append('<li>Название предмета: <span id=item_name_ide>[ Неизвестно ]</span> [<span id=item_id_ide>?</span>]</li><li>Уникальный ID: <span id=item_uq_id_ide>[ Неизвестно ]</span></li>');
        $("body").on('click', "#itemList .itemInMouth", function () {
          if (!$(this).hasClass("active_thing")) {
            let uq_id = $(this).attr('id');
            $("#item_uq_id_ide").html(uq_id);
            let item_id = $(this).find("img").attr("src").replace(/\D/g, "");
            let name = item_names_json[item_id] || "[ Неизвестно ]";
            $("#item_name_ide").html(name);
            $("#item_id_ide").html(item_id);
          }
        });
      });
    }
    if (globals.on_idCatMouth) {
      $(document).ready(function () {
        $("#ctdey > ul").append('<li>ID кота: <span id=cat_id_ide>[ Не определено ]</span></li>');
        $("body").on('click', "#itemList .catrot", function () {
          if (!$(this).hasClass("active_thing")) {
            $("#cat_id_ide").html($(this).attr('id'));
          }
        });
      });
    }
    if (globals.on_actNotif) {
      function which_action(text) {
        const act_detect = {
          "move": "Переход",
          "eat": " дичь",
          "eat1": "Перекусывать",
          "need": "Делаем свои дела",
          "drink": "Пьём ещё",
          "dig": "Копать",
          "sleep": "Сон",
          "sniff": "нюх",
          "digin": "Закапывать",
          "clean": "Вылизывать",
          "swim": "Плавать",
          "fill_moss": "Наполнять мох",
          "murr": "Мурлыкать",
          "tails": "Переплетаем хвосты",
          "cheek": "Трёмся щекой",
          "ground": "Валяем по земле",
          "rub": "Тереться носом о нос",
          "calm": "Успокаиваться",
          "watch": "Осматривать окрестности",
          "marking": "Помечать территорию",
          "clawscratch": "Точить когти",
          "rug": "Чистить ковёр",
          "attention": "Привлекать внимание",
          "domestsleep": "Спать ",
          "checkup": "Осматривать к",
          "loottr": "Осматривать дупло",
          "lootcr": "Осматривать расщелину"
        };
        const act_flav_text = {
          "move": "Переход",
          "eat": "Поедание дичи",
          "eat1": "Поедание дичи",
          "need": "Справление нужды",
          "drink": "Питьё",
          "dig": "Копание",
          "sleep": "Сон",
          "sniff": "Нюх",
          "digin": "Закапывание",
          "clean": "Вылизывание",
          "swim": "Плавание",
          "fill_moss": "Наполнение мха",
          "murr": "Мурлыкаем",
          "tails": "Переплетаем хвосты",
          "cheek": "Трёмся щекой",
          "ground": "Валяем по земле",
          "rub": "Трёмся носом о нос",
          "calm": "Выход из боевой стойки",
          "watch": "Осмотр окрестностей",
          "marking": "Пометка территории",
          "clawscratch": "Затачивание когтей",
          "rug": "Чистка ковра",
          "attention": "Привлечение внимания",
          "domestsleep": "Сон в лежанке",
          "checkup": "Осмотр целителем",
          "loottr": "Осмотр дупла",
          "lootcr": "Осмотр расщелины"
        };
        let wh_act = {
          txt: null,
          snd: false
        };
        $.each(act_detect, function (actid, acttext) {
          if (text.indexOf(acttext) !== -1) {
            if (globals["txt_act_" + actid]) wh_act.txt = act_flav_text[actid];
            if (globals["snd_act_" + actid]) wh_act.snd = true;
            return wh_act;
          }
        });
        return wh_act;
      }
      let rang = false;
      let move_ok = false; // можно проигрывать звук
      let action = which_action($("#block_mess").html());

      $("body").on('DOMSubtreeModified', "#block_mess", function () { //На изменении блока-сообщения о времени действия или переносе твоего зада куда-то
        if ($('#sek').text().length) { //Если текст #sek существует
          let time = $('#sek').text();
          action = which_action($("#block_mess").html());
          //console.log('action sound: '+action.snd+'; action text: '+action.txt);
          if (time == '7 с' || time == '6 с') move_ok = true; //Действие длится хотя бы 7 секунд -С МОМЕНТА ОТКРЫТИЯ ИГРОВОЙ-
          if (action.txt !== null) $('title').text(time + " / " + action.txt); //Сменить титульник, если текст на это действие включен
          let datenow = new Date();
          if (!action.snd) rang = true; //Реагировать только на нужные навыки ("звук был" = да)
          if ((time === '2 с' || time === '1 с') && !rang && move_ok) { //Свернутая вкладка обновляется каждые 2 секунды, F // До конца действия 1-2 сек, звука ещё не было/звук включен, звук можно проигрывать
            playAudio(sounds.action_notif, globals.sound_notifEndAct);
            rang = true;
            move_ok = false;
          }
        }
        if ($("#block_mess").html() === "") { //Если пуст, действий нет
          $('title').text('Игровая / CatWar');
          rang = false;
          move_ok = false;
        }
      });
    }
    if (globals.notif_eaten) { //Уведомления, когда вас поднимают
      $("body").on('DOMSubtreeModified', "#block_mess", function () {
        if ($("#block_mess").html().indexOf("Вы не сможете выбраться") !== -1) {
          $('title').text("Во рту");
          playAudio(sounds.sound_notifEndAct, globals.sound_notifEaten);
        }
        if ($("#block_mess").html() === "" && !globals.on_actNotif) { //Если пуст, действий нет (нужно, если нет уведомлений на действия)
          $('title').text('Игровая / CatWar');
        }
      });
    }
    if (globals.notif_attack) {
      $("#history_block").on('DOMSubtreeModified', '#ist', function () {
        let last_note = $($("#ist").html().split('.')).get(-2);
        if (last_note !== undefined) {
          console.log();
          if (last_note.indexOf("в боережим, поскольку на меня напал") !== -1) {
            playAudio(sounds.alert_attacked, globals.sound_notifBeaten);
          }
        }
      });
    }
    if (globals.on_moveFightLog) {
      $('#app').ready(function () { //Возможность перетаскивать панель лога боя
        $('head').append(`<style>#fightPanelHandle {
                                display:inline-block;
                                height:16px;
                                width:16px;
                                background: url(https://abstract-shed.site/cwm_catalog/untargeted.png) center no-repeat;
                                background-color: #ccc;
                                margin-right:4px;
                                border-radius: 5px;
                                padding: 1px;
                                position: relative;
                                top: 5px;
                                left: 3px;
                            }
                            #fightPanelHandle:active {
                                background: url(https://abstract-shed.site/cwm_catalog/targeted.png) center no-repeat;
                                background-color: #ccc;
                            }</style>`);
        $("#fightPanel").prepend(`<a id="fightPanelHandle"></a>`);
        $("#fightPanel").draggable({
          handle: "#fightPanelHandle"
        });
      });
    }
    if (globals.on_blockNotif) {
      let block = false;
      $('#app').ready(function () {
        $('#block').on('load', function () {
          if ($(this).attr('src') == 'symbole/lock.png') { //locked
            block = true;
            playAudio(sounds.block_start, globals.sound_blockStart);
          }
          else if (block) { //unlocked
            block = false;
            playAudio(sounds.block_end, globals.sound_blockEnd);
          }
        });
      });
    }
    if (globals.fight_log_max_height != 70) {
      $('#fightLog').css('height', globals.fight_log_max_height);
    }
    if (globals.on_shortFightLog) {
      $(document).ready(function () {
        let prev_log = '';
        let prev_class = '';
        $("#fightLog").on('DOMNodeInserted', 'span:not(.cws-hit-count)', function (e) {
          let this_log = $(this).html();
          let this_class = $(this).attr('class');
          if (this_log == prev_log && prev_class == this_class) {
            $(this).remove();
            $('#fightLog > br:first-child').remove(); //чистка
            let $to_change = $('.cws-hit-count').first();
            let count = parseInt($to_change.attr('count'));
            count++;
            $to_change.attr('count', count);
            $to_change.html(' (х' + count + ')');
          }
          else { //новый удар
            $('<span class="cws-hit-count ' + this_class + '" count=1></span>').insertAfter($(this));
          }
          prev_log = this_log;
          prev_class = this_class;
        });
      });
    }
    if (globals.on_teamFights) {
      $('head').append(`<style>
:root {
--team1g: ${globals.tf_color_g_team1};
--team1r: ${globals.tf_color_r_team1};
--team2g: ${globals.tf_color_g_team2};
--team2r: ${globals.tf_color_r_team2};
--team3g: ${globals.tf_color_g_team3};
--team3r: ${globals.tf_color_r_team3};
--team4g: ${globals.tf_color_g_team4};
--team4r: ${globals.tf_color_r_team4};
}
.arrow_green {background: var(--team1g);}
.arrow_red {background: var(--team1r);}
label.team-1 {background: var(--team1g);color: var(--team1g);}
label.team-2 {background: var(--team2g);color: var(--team2g);}
label.team-3 {background: var(--team3g);color: var(--team3g);}
label.team-4 {background: var(--team4g);color: var(--team4g);}
#fteams-table {width: 100%; background-color: #ccccccd7;}
#fteams-table input[type="radio"] {display:none;}
#fteams-table td, #fteams-table th {
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
}
.lbl {width: 25px;}
.cws-team {
  text-align: center;
  display: block;
  width: 20px;
  height: 15px;
  margin: 2px;
  border: 2px solid transparent;
}
input:checked + .cws-team {
  border: 2px solid black;
  font-weight: bold;
  color: black;
}
#fightPanel {height: max-content;}
#fteams-wrap {
  margin: 5px 0;
  max-height: ${globals.tf_max_height}px;
  overflow-y: scroll;
}
#refresh-team {width: 100%;}
.tf-color {color:black;}
</style>`); //Определение цветов команд
      $('head').append(`<style id=cws_team_fights></style>`); //Заготовка раскраски команд
      $("#app").ready(function () {
        let ids = {}; //Список айди
        $("#fightPanel").append(`<div id=fteams-wrap>
                        <table id=fteams-table>
                        <thead>
                        <th class="tf-color">Имя</th>
                        <th class="tf-color" colspan=4>Команда</th>
                        </thead>
                        <tbody id=fightColors></tbody>
                        </table>
                        <button id=refresh-team>Обновить список</button>
                        </div>`); //Добавление списка в панель бр
        $("#refresh-team").on("click", function () { //Кнопка "Обновить"
          $('#fightColors > tr').each(function () { //Удалить старое
            let id = $(this).attr('id').match(/\d+/)[0];
            if (!$("#arrow" + id).length) { //если не существует кота из списка в боережиме
              $("#team_member_" + id).remove();
              delete ids[id];
            }
          });
          $('.arrow').each(function () {
            let id = $(this).attr('id').match(/\d+/)[0];
            if (!ids[id]) { //Добавить новое
              ids[id] = 1; //team 1
              let name = $(".cat_tooltip a[href='/cat" + id + "']").html();
              $("#fightColors").append(`<tr id=team_member_${id}><td class="tf-color">${name}</td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" checked value="1" id="chk${id}-team-1"><label class="cws-team team-1" for="chk${id}-team-1">*</label></td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" value="2" id="chk${id}-team-2"><label class="cws-team team-2" for="chk${id}-team-2">*</label></td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" value="3" id="chk${id}-team-3"><label class="cws-team team-3" for="chk${id}-team-3">*</label></td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" value="4" id="chk${id}-team-4"><label class="cws-team team-4" for="chk${id}-team-4">*</label></td>
                            </tr>`);
            }
          });
        });
        $(document).on('change', '.cws-team-chk', function () { //Изменение команды при клике
          let id = $(this).attr('id').match(/\d+/)[0];
          ids[id] = parseInt($(this).val());
          let style = '\n'; //Формирование нового стиля
          $.each(ids, function (id, team) {
            style += `#arrow${id} .arrow_green {background: var(--team${team}g);}\n#arrow${id} .arrow_red {background: var(--team${team}r);}\n`;
          });
          $('#cws_team_fights').html(style);
        });
      });
    }
    if (globals.on_cleanerHistory) {
      let titles = {};
      const convert = {
        "Котёнок": "котёнка",
        "Оруженосец": "оруженосца",
        "Ученица целителя": "ученицу целителя",
        "Ученик целителя": "ученика целителя",
        "Целительница": "целительницу",
        "Целитель": "целителя",
        "Воительница": "воительницу",
        "Воитель": "воителя",
        "Старшая воительница": "старшую воительницу",
        "Старший воитель": "старшего воителя",
        "Старейшина": "старейшину",
        "Глашатая": "глашатую",
        "Глашатай": "глашатая",
        "Предводительница": "предводительницу",
        "Предводитель": "предводителя",
        "Будущая стражница": "будущую стражницу",
        "Будущий страж": "будущего стража",
        "Будущая охотница": "будущую охотницу",
        "Будущий охотник": "будущего охотника",
        "Стражница": "стражницу",
        "Страж": "стража",
        "Охотница": "охотницу",
        "Охотник": "охотника",
        "Врачеватель": "врачевателя",
        "Ученица врачевателя": "ученицу врачевателя",
        "Ученик врачевателя": "ученика врачевателя",
        "Ученица": "ученицу",
        "Ученик": "ученика",
        "Молодой воин": "молодого воина",
        "Воин": "воина",
        "Старший воин": "старшего воина",
        "Учитель": "учителя",
        "Воин света": "воина света",
        "Слышащая": "слышащую",
        "Слышащий": "слышащего",
        "Ученица слышащего": "ученицу слышащего",
        "Ученик слышащего": "ученика слышащего",
        "Доверенная": "доверенную",
        "Доверенный": "доверенного",
        "Наследница": "наследницу",
        "Наследник": "наследника",
        "Хранитель моря": "хранителя моря",
        "Верховная хранительница покоя": "верховную хранительницу покоя",
        "Верховный хранитель покоя": "верховного хранителя покоя",
        "Верховная добытчица": "верховную добытчицу",
        "Верховный добытчик": "верховного добытчика",
        "Верховная жрица": "верховную жрицу",
        "Верховный жрец": "верховного жреца",
        "Глава Верховного Совета": "главу Верховного Совета",
        "Советница верховного жреца": "советницу верховного жреца",
        "Советник верховного жреца": "советника верховного жреца",
        "Советница верховного хранителя покоя": "советницу верховного хранителя покоя",
        "Советник верховного хранителя покоя": "советника верховного хранителя покоя",
        "Советница верховного добытчика": "советницу верховного добытчика",
        "Советник верховного добытчика": "советника верховного добытчика",
        "Лунная жрица": "лунную жрицу",
        "Лунный жрец": "лунного жреца",
        "Добытчица": "добытчицу",
        "Добытчик": "добытчика",
        "Хранительница покоя": "хранительницу покоя",
        "Хранитель покоя": "хранителя покоя",
        "Ученица хранителей покоя": "ученицу хранителей покоя",
        "Ученик хранителей покоя": "ученика хранителей покоя",
        "Ученица добытчиков": "ученицу добытчиков",
        "Ученик добытчиков": "ученика добытчиков",
        "Старец": "старца",
        "Королева": "королеву",
        "Наследник хранителя": "наследника хранителя",
        "Хранительница солнца": "хранительницу солнца",
        "Хранитель солнца": "хранителя солнца",
        "Заместительница глашатая": "заместительницу глашатая",
        "Заместитель глашатая": "заместителя глашатая",
        "Восходящая": "восходящую",
        "Восходящий": "восходящего",
        "Командор серых стражей": "командора серых стражей",
        "Ведущая": "ведущую",
        "Ведущий": "ведущего",
        "Ученица Луны": "ученицу Луны",
        "Ученик Луны": "ученика Луны",
        "Королева": "королеву",
        "Заботливый отец": "заботливого отца",
        "Ведущая воительница": "ведущую воительницу",
        "Ведущий воитель": "ведущего воителя",
        "Молодая воительница": "молодую воительницу",
        "Молодой воин": "молодого воина",
        "Помощница ученика врачевателя": "помощницу ученика врачевателя",
        "Помощник ученика врачевателя": "помощника ученика врачевателя",
        "Старший оруженосец": "старшего оруженосца",
        "Переходящая": "переходящую",
        "Переходящий": "переходящего",
        "Советница": "советницу",
        "Советник": "советника",
        "Воспитанник": "воспитанника",
        "Воспитанница": "воспитанницу",
        "Старший воспитанник": "старшего воспитанника",
        "Старший воспитанница": "старшую воспитанницу",
        "Вождь": "вождя",
        "Мудрец": "мудреца",
        "Искусник": "искусника",
        "Наместник": "наместника",
        "Пилигрим": "пилигрима",
        "Ловец": "ловца",
        "Шаман": "шамана",
        "Кормилица": "кормилицу",
        "Воевода": "воеводу"
      };

      function title_convert(title) {
        return convert[title];
      }
      if (globals.clean_title) {
        $(document).ready(function () {
          $("#cages").on('DOMNodeRemoved', '.catWithArrow', function () {
            let href = $(this).find('.cat_tooltip > u > a').attr('href');
            if (href !== undefined) {
              let cat_id = href.replace(/\D/g, '');
              if (titles[cat_id] === undefined) {
                let title = $(this).find('.cat_tooltip > small > i').html();
                titles[cat_id] = title;
              }
            }
          });
        });
      }
      let first_load = true;
      let cl_history = (window.localStorage.getItem('cws_cleaner_history_log') !== null) ? window.localStorage.getItem('cws_cleaner_history_log') : 'История очищена.';
      $("#ist").ready(function () {
        // ДОБАВЛЕНИЕ ЛОГА ЧИСТИЛЬЩИКОВ
        $('<hr><h2><a href=\"#\" id=cleaner class=toggle>Деятельность в чистильщиках:</a></h2><span id=cleaner_block>' + cl_history + '</span><br><a id=erase_cleaner href=#>Очистить историю чистки</a>').insertAfter("#history_clean");
        let prev_ist = undefined;
        let prev_prev_ist = undefined;
        $("#history_block").on('DOMSubtreeModified', '#ist', function () {
          if (first_load) {
            first_load = false;
          }
          else {
            let last_ist = $("#ist").html().split('.'); // to array
            last_ist = last_ist[last_ist.length - 2]; //последняя запись ( -1 тк длина с 1, а массив с 0; -1 тк последняя запись нулевая из-за точки в конце истории)
            if (last_ist !== undefined) {
              let clean_id = last_ist.match(/cat(\d+)/);
              if (clean_id) {
                clean_id = clean_id[1];
              }
              last_ist = last_ist.trim().replace(/(<([^>]+)>)/ig, ''); // последняя запись
              if (((last_ist.indexOf("Поднял") !== -1) || (last_ist.indexOf("Опустил") !== -1)) && ((last_ist.indexOf("кота") !== -1) || (last_ist.indexOf("кошку") !== -1))) { //Если есть "поднял(а)/опустил(а) кота/кошку"
                let hist_str = ' ' + last_ist;
                if (globals.clean_id) {
                  hist_str += ' (' + clean_id + ')';
                } //Записать ID
                if (globals.clean_location) {
                  hist_str += ' в локации «' + $("#location").html() + '»';
                } //Записать локацию
                hist_str += '.';
                if ((globals.clean_action) &&
                  (last_ist.indexOf("Поднял") !== -1) &&
                  (prev_prev_ist !== undefined) &&
                  (prev_ist.indexOf("Отменил") !== -1) && //Отменил действие
                  (prev_prev_ist.indexOf("по имени") !== -1) && //Перед этим взаимодействуя с кем-то (только не проверяйте других избиением в тетрисе лол)
                  (prev_prev_ist.indexOf("Поднял") === -1) && //Не поднял и не опустил
                  (prev_prev_ist.indexOf("Опустил") === -1)) {
                  let clean_curr_name = last_ist.match(/ по имени ([А-Яа-яЁё ]+)/u) || ['', ''];
                  let clean_check_name = prev_prev_ist.match(/ по имени ([А-Яа-яЁё ]+)/u) || ['', ''];
                  if (clean_check_name[1] !== '' && clean_check_name[1] == clean_curr_name[1]) { //Имя проверенного и имя поднятого одинаковые
                    let their_pol = (last_ist.indexOf("кошку") !== -1) ? 'кошку' : 'кота'; //Вообще-то пронаунс это ОЧЕНЬ важно
                    let ur_pol = (last_ist.indexOf("Подняла") !== -1) ? 'Проверила' : 'Проверил'; //хаххаахаххахаха
                    hist_str = ' ' + ur_pol + ' ' + their_pol + ' по имени ' + clean_check_name[1] + '.' + hist_str;
                  }
                }
                if (globals.clean_title && titles[clean_id] !== undefined) {
                  hist_str = hist_str.replace(/(кота|кошку)/g, title_convert(titles[clean_id]));
                } //Поменять на должность
                if ($("#location").html() != '[ Загружается… ]' && hist_str !== undefined) { //ок?
                  $('#cleaner_block').append(hist_str);
                  window.localStorage.setItem('cws_cleaner_history_log', $('#cleaner_block').html());
                }
              }
              prev_prev_ist = prev_ist;
              prev_ist = last_ist;
            }
          }
        });
        $('#erase_cleaner').on('click', function () {
          $('#cleaner_block').html("История очищена.");
          window.localStorage.setItem('cws_cleaner_history_log', 'История очищена.');
        });
      });
    }
    if (globals.on_treeTechies) {
      if (globals.tt_notif_refresh) {
        let last_note, note_first = true;
        $("#history_block").on('DOMSubtreeModified', '#ist', function () {
          last_note = $($("#ist").html().split('.')).get(-2); //Последняя запись в истории
          if (last_note !== undefined) {
            if (/Услышала? оглушительный/.test(last_note) && !note_first) {
              console.log("Обновилась лазательная локация");
              playAudio(sounds.tt_refresh, globals.sound_ttRefresh);
            }
            note_first = false; //История была уже прочитана 1 раз, и страница не только что загрузилась
          }
        });
      }
      $('#app').ready(function () {
        $('head').append(`<style>
#cws_treeTechies.hidden{display:none;}
#cws_treeTechiesHandle, #cws_treeTechiesFold {
  display: inline-block;}
#cws_treeTechiesHandle {width: 84%;}
#cws_treeTechiesFold {width: 14%; border-left: 1px solid #ffebce;}
#cws_treeTechies {
  z-index:99;
  overflow:hidden;
  position: absolute;
  top: ${globals.tt_window_top}px;
  left: ${globals.tt_window_left}px;
  width: 270px;
  background-color: #ffebce;
  border-radius:10px;
}
#cws_treeTechies.folded {
height: 25px;
}
#cws_treeTechiesHandleWrap {
  padding: 2px 0;
  text-align:center;
  display: inline-block;
  font-size:13pt;
  width: 270px;
  background-color: #fff;
}
#cws_tt_choose {margin:10px;}
.cws-tt-cell:checked + label > span {
  font-weight: bold;
}
.cws-tt-table {
  margin: 10px;
  border: 1px solid #171717;
}
#cws_treeTechies {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.cws-tt-table td {
  font-size: 11pt;
  text-align: center;
    vertical-align: middle;
  height: 30px;
  width: 22px;
  border: 1px solid #171717;
}
.cws-tt-table .cws-tt-safe, .cws-tt-table .cws-tt-safe-def {
  background-color: rgba(255,255,255,.75);
}
.cws-tt-table .cws-tt-unsafe {background-color: rgba(204,102,0,.45);}
#cws_tt_clear_btn {
  margin: 0px 3% 5px 3%;
  padding: 5px 10px;
  width: 94%;
}
.cws-tt-fold-hidden {display:none;}
#cages .cws-tt-unsafe {background-color: rgba(43, 11, 11, .5);}
#cages .cws-tt-safe, #cages .cws-tt-safe-def {background-color: rgba(247, 255, 236, .2);}
.cws-tt-page, .cws-tt-folder {display:none;}
.cws-tt-page-lbl, .cws-tt-folder-lbl {
  display: inline-block;
  background-color: rgb(239, 239, 239);
  color: black;
  padding: 2px 10px;
  border-width:2px;
  border-style: solid;
  border-radius: 3px;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-bottom-color: rgb(118, 118, 118);
  border-right-color: rgb(118, 118, 118);
}
.cws-tt-page:checked + .cws-tt-page-lbl, .cws-tt-folder:checked + .cws-tt-folder-lbl {
  background-color: #cc6600;
  border-bottom-color: #ffffff;
  border-right-color: #ffffff;
  border-top-color: rgb(118, 118, 118);
  border-left-color: rgb(118, 118, 118);
  color: white;
}
.cws-tt-page-hidden {display:none;}</style>`);
        if (globals.tt_dark_theme) {
          $('head').append(`<style>#cws_treeTechiesFold {border-left: 1px solid #505457;}
#cws_treeTechies {background-color: #505457; color:#ebeef0;}
#cws_treeTechiesHandleWrap {background-color: #ccc;color: #27292b;}
.cws-tt-table .cws-tt-safe, .cws-tt-table .cws-tt-safe-def {background-color: rgba(255,255,255,.2);}
.cws-tt-table .cws-tt-unsafe {background-color: rgba(0,0,0,.2);}
.cws-tt-page:checked + .cws-tt-page-lbl, .cws-tt-folder:checked + .cws-tt-folder-lbl {background-color:#6f7577;}</style>`);
        }
        if (globals.tt_show_volume) {
          $('head').append(`<style>.vlm0 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 0)";}
.vlm1 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 1)";}
.vlm2 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 2)";}
.vlm3 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 3)";}
.vlm4 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 4)";}
.vlm5 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 5)";}
.vlm6 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 6)";}
.vlm7 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 7)";}
.vlm8 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 8)";}
.vlm9 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 9)";}
.vlm10 > span:not(.mod_id_wrap) > i:after {content:" (Громкость: 10)";}</style>`);
        }
        const tt_field_def = `<tbody><tr><td class="cws-tt-safe-def"></td><td class="cws-tt-safe-def"></td><td class="cws-tt-safe-def"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody>`;
        let old_fields = (getSettings('tt_field1') || getSettings('tt_field2') ||
          getSettings('tt_field3') || getSettings('tt_field4') ||
          getSettings('tt_field5') || getSettings('tt_field6') ||
          getSettings('tt_field7') || getSettings('tt_field8') ||
          getSettings('tt_field9') || getSettings('tt_field10') ||
          getSettings('tt_field11') || getSettings('tt_field12') ||
          getSettings('tt_field13') || getSettings('tt_field14') ||
          getSettings('tt_field15') || getSettings('tt_field16') ||
          getSettings('tt_field17') || getSettings('tt_field18') ||
          getSettings('tt_field19') || getSettings('tt_field20'));
        let tt_fields = getSettings('tt_fields') === null ? [tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def,
          tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def,
          tt_field_def, tt_field_def, tt_field_def, tt_field_def
        ] : JSON.parse(getSettings('tt_fields'));
        if (old_fields) {
          for (let i = 1; i <= 20; i++) {
            if (getSettings('tt_field' + i) !== null) {
              tt_fields[i - 1] = getSettings('tt_field' + i);
            }
            removeSettings('tt_field' + i);
          }
          setSettings('tt_fields', JSON.stringify(tt_fields));
        }
        $('#app').append(`<div id="cws_treeTechies"${globals.tt_folded?' class="folded"':''}>
<div id="cws_treeTechiesHandleWrap"><div id="cws_treeTechiesHandle"><span>Минное поле</span></div><div id=cws_treeTechiesFold><img class="cws-tt-fold-minus${globals.tt_folded?' cws-tt-fold-hidden':''}" src="https://abstract-shed.site/cwm_catalog/minus.png"><img class="cws-tt-fold-plus${globals.tt_folded?'':' cws-tt-fold-hidden'}" src="https://abstract-shed.site/cwm_catalog/plus.png"></div></div>
<div id="cws_tt_choose">
<div><input type="radio" checked name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell0" value="0" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell0"><span>[0]</span> Без звука</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell1" value="1" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell1"><span>[1]</span> Едва различимый треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell2" value="2" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell2"><span>[2]</span> Тихий треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell3" value="3" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell3"><span>[3]</span> Приглушённый треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell4" value="4" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell4"><span>[4]</span> Громкий треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell5" value="5" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell5"><span>[5]</span> Очень громкий треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell6" value="6" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell6" title="Громкость в чате - 6 (выше среднего)"><span>[6]</span> Очень громкий треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell7" value="7" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cell7" title="Громкость в чате - 7 (выше среднего)"><span>[7]</span> Очень громкий треск</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellBad" value="X" mark="cws-tt-unsafe"><label class="cws-tt-cell-lbl" for="cws_tt_cellBad"><span>[X]</span> Опасная клетка</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellGood" value="" mark="cws-tt-safe"><label class="cws-tt-cell-lbl" for="cws_tt_cellGood"><span>Безопасная</span> клетка</label></div>
<div><input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellN" value="" mark=""><label class="cws-tt-cell-lbl" for="cws_tt_cellN"><span>О</span>чистить</label></div>
<hr style="margin: 4px 0 2px 0;">
<div><input type="checkbox" class="cws-tt-cell" id="cws_tt_show"><label class="cws-tt-cell-lbl" for="cws_tt_show">Переносить на Игровую</label></div>
<hr style="margin: 4px 0 2px 0;">
<input type="radio" checked name="cws_tt_folder" class="cws-tt-folder" value="0" id="cws_tt_folder0"><label class="cws-tt-folder-lbl" for="cws_tt_folder0">${globals.tt_foldersnamesArray[0]}</label>
${globals.tt_foldersenabledArray[1]?`<input type="radio" name="cws_tt_folder" class="cws-tt-folder" value="1" id="cws_tt_folder1"><label class="cws-tt-folder-lbl" for="cws_tt_folder1">${globals.tt_foldersnamesArray[1]}</label>`:''}
${globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_folder" class="cws-tt-folder" value="2" id="cws_tt_folder2"><label class="cws-tt-folder-lbl" for="cws_tt_folder2">${globals.tt_foldersnamesArray[2]}</label>`:''}
${globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_folder" class="cws-tt-folder" value="3" id="cws_tt_folder3"><label class="cws-tt-folder-lbl" for="cws_tt_folder3">${globals.tt_foldersnamesArray[3]}</label>`:''}
<hr style="margin: 4px 0 2px 0;">
<div>
<input type="radio" checked name="cws_tt_page" class="cws-tt-page" value="0" id="cws_tt_page0"><label class="cws-tt-page-lbl" folder="0" for="cws_tt_page0">${globals.tt_pagenamesArray[0]}</label>
${globals.tt_pageenabledArray[1]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="1" id="cws_tt_page1"><label class="cws-tt-page-lbl" folder="0" for="cws_tt_page1">${globals.tt_pagenamesArray[1]}</label>`:''}
${globals.tt_pageenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="2" id="cws_tt_page2"><label class="cws-tt-page-lbl" folder="0" for="cws_tt_page2">${globals.tt_pagenamesArray[2]}</label>`:''}
${globals.tt_pageenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="3" id="cws_tt_page3"><label class="cws-tt-page-lbl" folder="0" for="cws_tt_page3">${globals.tt_pagenamesArray[3]}</label>`:''}
${globals.tt_pageenabledArray[4]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="4" id="cws_tt_page4"><label class="cws-tt-page-lbl" folder="0" for="cws_tt_page4">${globals.tt_pagenamesArray[4]}</label>`:''}
${globals.tt_pageenabledArray[5]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="5" id="cws_tt_page5"><label class="cws-tt-page-lbl" folder="0" for="cws_tt_page5">${globals.tt_pagenamesArray[5]}</label>`:''}
${globals.tt_pageenabledArray[6] && globals.tt_foldersenabledArray[1] ?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="6" id="cws_tt_page6"><label class="cws-tt-page-lbl" style="display:none;" folder="1" for="cws_tt_page6">${globals.tt_pagenamesArray[6]}</label>`:''}
${globals.tt_pageenabledArray[7] && globals.tt_foldersenabledArray[1] ?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="7" id="cws_tt_page7"><label class="cws-tt-page-lbl" style="display:none;" folder="1" for="cws_tt_page7">${globals.tt_pagenamesArray[7]}</label>`:''}
${globals.tt_pageenabledArray[8] && globals.tt_foldersenabledArray[1] ?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="8" id="cws_tt_page8"><label class="cws-tt-page-lbl" style="display:none;" folder="1" for="cws_tt_page8">${globals.tt_pagenamesArray[8]}</label>`:''}
${globals.tt_pageenabledArray[9] && globals.tt_foldersenabledArray[1] ?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="9" id="cws_tt_page9"><label class="cws-tt-page-lbl" style="display:none;" folder="1" for="cws_tt_page9">${globals.tt_pagenamesArray[9]}</label>`:''}
${globals.tt_pageenabledArray[10] && globals.tt_foldersenabledArray[1] ?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="10" id="cws_tt_page10"><label class="cws-tt-page-lbl" style="display:none;" folder="1" for="cws_tt_page10">${globals.tt_pagenamesArray[10]}</label>`:''}
${globals.tt_pageenabledArray[11] && globals.tt_foldersenabledArray[1] ?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="11" id="cws_tt_page11"><label class="cws-tt-page-lbl" style="display:none;" folder="1" for="cws_tt_page11">${globals.tt_pagenamesArray[11]}</label>`:''}
${globals.tt_pageenabledArray[12] && globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="12" id="cws_tt_page12"><label class="cws-tt-page-lbl" style="display:none;" folder="2" for="cws_tt_page12">${globals.tt_pagenamesArray[12]}</label>`:''}
${globals.tt_pageenabledArray[13] && globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="13" id="cws_tt_page13"><label class="cws-tt-page-lbl" style="display:none;" folder="2" for="cws_tt_page13">${globals.tt_pagenamesArray[13]}</label>`:''}
${globals.tt_pageenabledArray[14] && globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="14" id="cws_tt_page14"><label class="cws-tt-page-lbl" style="display:none;" folder="2" for="cws_tt_page14">${globals.tt_pagenamesArray[14]}</label>`:''}
${globals.tt_pageenabledArray[15] && globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="15" id="cws_tt_page15"><label class="cws-tt-page-lbl" style="display:none;" folder="2" for="cws_tt_page15">${globals.tt_pagenamesArray[15]}</label>`:''}
${globals.tt_pageenabledArray[16] && globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="16" id="cws_tt_page16"><label class="cws-tt-page-lbl" style="display:none;" folder="2" for="cws_tt_page16">${globals.tt_pagenamesArray[16]}</label>`:''}
${globals.tt_pageenabledArray[17] && globals.tt_foldersenabledArray[2]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="17" id="cws_tt_page17"><label class="cws-tt-page-lbl" style="display:none;" folder="2" for="cws_tt_page17">${globals.tt_pagenamesArray[17]}</label>`:''}
${globals.tt_pageenabledArray[18] && globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="18" id="cws_tt_page18"><label class="cws-tt-page-lbl" style="display:none;" folder="3" for="cws_tt_page18">${globals.tt_pagenamesArray[18]}</label>`:''}
${globals.tt_pageenabledArray[19] && globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="19" id="cws_tt_page19"><label class="cws-tt-page-lbl" style="display:none;" folder="3" for="cws_tt_page19">${globals.tt_pagenamesArray[19]}</label>`:''}
${globals.tt_pageenabledArray[20] && globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="20" id="cws_tt_page20"><label class="cws-tt-page-lbl" style="display:none;" folder="3" for="cws_tt_page20">${globals.tt_pagenamesArray[20]}</label>`:''}
${globals.tt_pageenabledArray[21] && globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="21" id="cws_tt_page21"><label class="cws-tt-page-lbl" style="display:none;" folder="3" for="cws_tt_page21">${globals.tt_pagenamesArray[21]}</label>`:''}
${globals.tt_pageenabledArray[22] && globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="22" id="cws_tt_page22"><label class="cws-tt-page-lbl" style="display:none;" folder="3" for="cws_tt_page22">${globals.tt_pagenamesArray[22]}</label>`:''}
${globals.tt_pageenabledArray[23] && globals.tt_foldersenabledArray[3]?`<input type="radio" name="cws_tt_page" class="cws-tt-page" value="23" id="cws_tt_page23"><label class="cws-tt-page-lbl" style="display:none;" folder="3" for="cws_tt_page23">${globals.tt_pagenamesArray[23]}</label>`:''}
</div>
</div>
<table class="cws-tt-table" page="0">${tt_fields[0]}</table>
${globals.tt_pageenabledArray[1]?`<table class="cws-tt-table" style="display:none;" page="1">${tt_fields[1]}</table>`:''}
${globals.tt_pageenabledArray[2]?`<table class="cws-tt-table" style="display:none;" page="2">${tt_fields[2]}</table>`:''}
${globals.tt_pageenabledArray[3]?`<table class="cws-tt-table" style="display:none;" page="3">${tt_fields[3]}</table>`:''}
${globals.tt_pageenabledArray[4]?`<table class="cws-tt-table" style="display:none;" page="4">${tt_fields[4]}</table>`:''}
${globals.tt_pageenabledArray[5]?`<table class="cws-tt-table" style="display:none;" page="5">${tt_fields[5]}</table>`:''}
${globals.tt_pageenabledArray[6]?`<table class="cws-tt-table" style="display:none;" page="6">${tt_fields[6]}</table>`:''}
${globals.tt_pageenabledArray[7]?`<table class="cws-tt-table" style="display:none;" page="7">${tt_fields[7]}</table>`:''}
${globals.tt_pageenabledArray[8]?`<table class="cws-tt-table" style="display:none;" page="8">${tt_fields[8]}</table>`:''}
${globals.tt_pageenabledArray[9]?`<table class="cws-tt-table" style="display:none;" page="9">${tt_fields[9]}</table>`:''}
${globals.tt_pageenabledArray[10]?`<table class="cws-tt-table" style="display:none;" page="10">${tt_fields[10]}</table>`:''}
${globals.tt_pageenabledArray[11]?`<table class="cws-tt-table" style="display:none;" page="11">${tt_fields[11]}</table>`:''}
${globals.tt_pageenabledArray[12]?`<table class="cws-tt-table" style="display:none;" page="12">${tt_fields[12]}</table>`:''}
${globals.tt_pageenabledArray[13]?`<table class="cws-tt-table" style="display:none;" page="13">${tt_fields[13]}</table>`:''}
${globals.tt_pageenabledArray[14]?`<table class="cws-tt-table" style="display:none;" page="14">${tt_fields[14]}</table>`:''}
${globals.tt_pageenabledArray[15]?`<table class="cws-tt-table" style="display:none;" page="15">${tt_fields[15]}</table>`:''}
${globals.tt_pageenabledArray[16]?`<table class="cws-tt-table" style="display:none;" page="16">${tt_fields[16]}</table>`:''}
${globals.tt_pageenabledArray[17]?`<table class="cws-tt-table" style="display:none;" page="17">${tt_fields[17]}</table>`:''}
${globals.tt_pageenabledArray[18]?`<table class="cws-tt-table" style="display:none;" page="18">${tt_fields[18]}</table>`:''}
${globals.tt_pageenabledArray[19]?`<table class="cws-tt-table" style="display:none;" page="19">${tt_fields[19]}</table>`:''}
${globals.tt_pageenabledArray[20]?`<table class="cws-tt-table" style="display:none;" page="20">${tt_fields[20]}</table>`:''}
${globals.tt_pageenabledArray[21]?`<table class="cws-tt-table" style="display:none;" page="21">${tt_fields[21]}</table>`:''}
${globals.tt_pageenabledArray[22]?`<table class="cws-tt-table" style="display:none;" page="22">${tt_fields[22]}</table>`:''}
${globals.tt_pageenabledArray[23]?`<table class="cws-tt-table" style="display:none;" page="23">${tt_fields[23]}</table>`:''}
<button id="cws_tt_clear_btn">Очистить всё поле</button>
</div>`);
        let proj = false; //свитч переноса
        let page = 0; //страница
        let text = '0';
        let mark = 'cws-tt-safe';
        $("#cws_treeTechies").draggable({
          containment: "document",
          handle: "#cws_treeTechiesHandle",
          drag: function () {
            let offset = $(this).offset();
            let xPos = offset.left;
            let yPos = offset.top;
            setSettings('tt_window_left', offset.left);
            setSettings('tt_window_top', offset.top);
          }

        });

        let selFolder = getSettings('tt_selected_folder');
        if (selFolder !== null) {
          if (!$('#cws_tt_folder' + selFolder).length) {
            selFolder = '0';
          }
          $('#cws_tt_folder' + selFolder).click();
          $('.cws-tt-page-lbl').hide();
          $('.cws-tt-page-lbl[folder=' + selFolder + ']').show();
          $('.cws-tt-page-lbl[folder=' + selFolder + ']')[0].click();
          let pageid = $('.cws-tt-page-lbl[folder=' + selFolder + ']').attr('for');
          let $pageinp = $('#' + pageid + '');
          $('.cws-tt-table[page=' + page + ']').hide();
          page = $pageinp.val();
          $('.cws-tt-table[page=' + page + ']').show();
        }

        function tt_setStyle($elem, style) {
          $elem.removeClass('cws-tt-safe cws-tt-unsafe').addClass(style);
          if (proj) {
            let col = $elem.index();
            let row = $elem.parent().index();
            $('#cages > tbody > tr').eq(row).children().eq(col).removeClass('cws-tt-safe cws-tt-unsafe').addClass(style);
          }
        }

        function tt_draw() {
          $('.cws-tt-table[page=' + page + '] td.cws-tt-safe, .cws-tt-table[page=' + page + '] td.cws-tt-unsafe, .cws-tt-table[page=' + page + '] td.cws-tt-safe-def').each(function () {
            let col = $(this).index();
            let row = $(this).parent().index();
            if ($(this).hasClass('cws-tt-safe') || $(this).hasClass('cws-tt-safe-def')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('cws-tt-safe');
            }
            else if ($(this).hasClass('cws-tt-unsafe')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('cws-tt-unsafe');
            }
          })
        }
        $('body').on('change', 'input[name="cws_tt_page"]', function () {
          $('.cws-tt-table[page=' + page + ']').hide();
          page = $(this).val();
          $('.cws-tt-table[page=' + page + ']').show();
          if (proj) {
            $('#cages > tbody > tr > td.cws-tt-safe').each(function () {
              $(this).removeClass('cws-tt-safe')
            });
            $('#cages > tbody > tr > td.cws-tt-unsafe').each(function () {
              $(this).removeClass('cws-tt-unsafe')
            });
            tt_draw();
          }
        });
        $('body').on('change', 'input[name="cws_tt_folder"]', function () {
          let folder = $(this).val();
          setSettings('tt_selected_folder', folder);
          $('.cws-tt-page-lbl').hide();
          $('.cws-tt-page-lbl[folder=' + folder + ']').show();
          $('.cws-tt-page-lbl[folder=' + folder + ']')[0].click();
        });
        $('body').on('change', 'input[name="cws_tt_cell"]', function () {
          text = $(this).val();
          mark = $(this).attr('mark');
        });
        $('body').on('click', '.cws-tt-table td', function () {
          $(this).html(text).removeClass('cws-tt-safe cws-tt-unsafe').addClass(mark);
          if (proj) {
            let col = $(this).index();
            let row = $(this).parent().index();
            $('#cages > tbody > tr').eq(row).children().eq(col).removeClass('cws-tt-safe cws-tt-unsafe').addClass(mark);
          }
          tt_fields[page] = $('.cws-tt-table[page=' + page + ']').html();
          setSettings('tt_fields', JSON.stringify(tt_fields));
        });
        $('body').on('click', '#cws_tt_clear_btn', function () {
          let ok = true;
          if (globals.tt_clean_confirm) {
            ok = confirm('Очистить поле?');
          }
          if (ok) {
            $('.cws-tt-table[page=' + page + '] td').each(function () {
              $(this).html('');
              tt_setStyle($(this), '');
            });
            tt_fields[page] = tt_field_def;
            setSettings('tt_fields', JSON.stringify(tt_fields));
          }
        });
        $('body').on('click', '#cws_treeTechiesFold', function () {
          $('#cws_treeTechies').toggleClass('folded');
          $('.cws-tt-fold-minus').toggleClass('cws-tt-fold-hidden');
          $('.cws-tt-fold-plus').toggleClass('cws-tt-fold-hidden');
        });
        $('body').on('change', '#cws_tt_show', function () {
          if ($(this).prop('checked')) {
            proj = true; //вкл свитч переноса
            tt_draw();
          }
          else {
            proj = false;
            $('#cages > tbody > tr > td.cws-tt-safe').removeClass('cws-tt-safe');
            $('#cages > tbody > tr > td.cws-tt-unsafe').removeClass('cws-tt-unsafe');
          }
        });
      });
    }
    if (globals.on_paramInfo) {
      function timeConv(sec) {
        let str = "";
        let hr = parseInt(sec / 3600);
        let mi = parseInt((sec - hr * 3600) / 60);
        let se = parseInt(sec - (hr * 3600 + mi * 60));
        str += ((hr) ? hr + " ч " : "");
        str += ((mi) ? mi + " мин " : "");
        str += ((se) ? se + " с" : "");
        return str.trim();
      }
      $('body').on('click', '#dream_table .symbole', function () {
        let green = $('#dream td:first-child').attr('style').replace(/\D/g, '');
        let moving = ($('#dream td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let perc = Math.round(green / 150 * 10000) / 100;
          error(`Сонливость: ${perc}% (${green}px).${(green<150)?` Спать${(green != '0')?` примерно ${timeConv((150-green)*20)}`:` 50 мин или более`}.`:''}`);
        }
      });
      $('body').on('click', '#hunger_table .symbole', function () {
        let green = $('#hunger td:first-child').attr('style').replace(/\D/g, '');
        let moving = ($('#hunger td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let perc = Math.round(green / 150 * 10000) / 100;
          error("Голод: " + perc + "% (" + green + "px).");
        }
      });
      $('body').on('click', '#thirst_table .symbole', function () {
        let green = $('#thirst td:first-child').attr('style').replace(/\D/g, '');
        let moving = ($('#thirst td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let perc = Math.round(green / 150 * 10000) / 100;
          error(`Жажда: ${perc}% (${green}px).${(green<150)?` Пить примерно ${timeConv((150-green)*60)}.`:''}`);
        }
      });
      $('body').on('click', '#need_table .symbole', function () {
        let green = $('#need td:first-child').attr('style').replace(/\D/g, '');
        let moving = ($('#need td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let min = (150 - green) / 2;
          let perc = Math.round(green / 150 * 10000) / 100;
          error(`Нужда: ${perc}% (${green}px).${(green<150)?` Справлять нужду${(green != '0')?` примерно ${timeConv(Math.trunc(min)*60)}${(Number.isInteger(min))?'':' 30 с'}`:` 1 ч 15 мин или более`}.`:''}`);
        }
      });
      $('body').on('click', '#clean_table .symbole', function () {
        let green = $('#clean td:first-child').attr('style').replace(/\D/g, '');
        let moving = ($('#clean td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let fleas = (green < 75) ? true : false;
          let perc = Math.round(green / 150 * 10000) / 100;
          let red = 150 - green;
          red = (red % 3) ? red : red - 0.5;
          let time = (red - 1) / 1.5 * 100 + 100;
          error(`Чистота: ${perc}% (${green}px).${(green<150)?` Вылизываться ${(fleas)?'уже поздно':timeConv(time)}.`:''}`);
        }
      });
      let healthText = '',
        hr;
      $('body').on('click', '#health_table .symbole', function () {
        let green = $('#health td:first-child').attr('style').replace(/\D/g, '');
        let perc = Math.round(green / 150 * 10000) / 100;
        healthText = "Здоровье: " + perc + "% (" + green + "px)";
        hr = setTimeout(function () {
          clearTimeout(hr);
          healthText = '';
        }, 10000);
      });
      $("body").on('DOMSubtreeModified', '#error', function () {
        let html = $(this).html();
        if (html && healthText !== '') {
          let tmp = healthText;
          healthText = '';
          $('#error').html(html + '<br>' + tmp);
        }
      });
    }
    const css_texts = {
      'on_csslocation': `<style id="cwsstyle_on_csslocation">div[style*="spacoj"] {background-image: url("${globals.css_locURL}") !important;}</style>`,
      'on_css_cellshade': `<style id="cwsstyle_on_css_cellshade">.cage {box-shadow: inset 0px ${globals.css_cellshadeOpacity}px 0px ${globals.css_cellshadeOpacity}px ${globals.css_cellshadeColor};}</style>`,
      'on_css_removesky': `<style id="cwsstyle_on_css_removesky">#sky {display:none;}</style>`,
      'on_css_oldicons': `<style id="cwsstyle_on_css_oldicons">[data-id='1']>img {content:url(http://d.zaix.ru/b6pm.png);}
[data-id='3']>img {content:url(http://d.zaix.ru/b6pp.png);}
[data-id='4']>img {content:url(http://d.zaix.ru/b6pC.png);}
[data-id='5']>img {content:url(http://d.zaix.ru/b6pD.png);}
[data-id='6']>img {content:url(http://d.zaix.ru/b6pK.png);}
[data-id='8']>img {content:url(http://d.zaix.ru/b6pE.png);}
[data-id='9']>img {content:url(http://d.zaix.ru/dIZZ.png);}
[data-id='11']>img {content:url(http://d.zaix.ru/c8wv.png);}
[data-id='12']>img {content:url(http://d.zaix.ru/b6po.png);}
[data-id='13']>img {content:url(http://d.zaix.ru/3989.png);}
[data-id='14']>img {content:url(http://d.zaix.ru/b6pM.png);}
[data-id='17']>img {content:url(http://d.zaix.ru/3aKJ.png);}
[data-id='18']>img {content:url(http://d.zaix.ru/dJ26.png);}
[data-id='19']>img {content:url(http://d.zaix.ru/dJ28.png);}
[data-id='24']>img {content:url(http://d.zaix.ru/criD.png);}
[data-id='27']>img {content:url(http://d.zaix.ru/aWBR.png);}
[data-id='28']>img {content:url(http://d.zaix.ru/buJT.png);}
[data-id='29']>img {content:url(http://d.zaix.ru/dcu3.png);}
[data-id='51']>img {content:url(http://d.zaix.ru/heaT.png);}
[data-id='52']>img {content:url(http://d.zaix.ru/heaU.png);}
[data-id='53']>img {content:url(http://d.zaix.ru/heaW.png);}
[data-id='exchange']>img {content:url(http://d.zaix.ru/aRJm.png);}
[data-id='flowers']>img {content: url(http://d.zaix.ru/aRIh.png);}
#dialog>img {content: url(http://d.zaix.ru/fpvK.png);}</style>`,
      'on_css_coloredparam': `<style id="cwsstyle_on_css_coloredparam">#dream td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}</style>`,
      'on_css_highlightmove': `<style id="cwsstyle_on_css_highlightmove">.move_parent:hover {
filter: drop-shadow(0px 0px 6px #ffffffcf);
transition: 0.2s;-webkit-transition: 0.2s;-o-transition: 0.2s;-moz-transition: 0.2s;
}.move_parent {transition: 0.3s;}</style>`,
      'on_css_maxopacity': `<style id="cwsstyle_on_css_maxopacity">.cat > div {opacity:1 !important;}</style>`,
      'on_css_newloading': `<style id="cwsstyle_on_css_newloading">[src*="/img/loading.gif"] {content: url(http://d.zaix.ru/hgx3.gif);}</style>`,
      'on_css_hideTooltip': `<style id="cwsstyle_on_css_hideTooltip">.cat:hover .cat_tooltip {display:none;}</style>`,
      'on_css_daylight': `<style id="cwsstyle_on_css_daylight">#cages_div {opacity: 1 !important;}</style>`
    };
    $.each(css_texts, function (index, value) {
      if (globals[index]) {
        $('head').append(css_texts[index]);
      }
    });
    //Быстрые настройки - TODO
    if (globals.on_css_quicksettings) {
      addCSS(`#cws_quick_settings_block {user-select:none;}`);
      $('#family').append(`<h2><a href="#" id="cws_quick_settings" class="toggle">Настройки CW:S</a></h2>
<div id="cws_quick_settings_block">
${globals.on_treeTechies?`<div><input id="on_treeTechies" type="checkbox" checked><label for="on_treeTechies">Показывать окно минного поля</label></div>`:''}
<div><input class="cwa-chk" id="on_css_cellshade" type="checkbox"${globals.on_css_cellshade?' checked':''}><label for="on_css_cellshade">Сетка ячеек локации</label></div>
<div><input class="cwa-chk" id="on_css_hideTooltip" type="checkbox"${globals.on_css_hideTooltip?' checked':''}><label for="on_css_hideTooltip">Скрыть всплывающее при наведении на кота окошко</label></div>
<div><input class="cwa-chk" id="on_csslocation" type="checkbox"${globals.on_csslocation?' checked':''}><label for="on_csslocation">Статичный фон на каждой локации</label></div>
<div><input class="cwa-chk" id="on_css_removesky" type="checkbox"${globals.on_css_removesky?' checked':''}><label for="on_css_removesky">Убрать небо</label></div>
<div><input class="cwa-chk" id="on_css_oldicons" type="checkbox"${globals.on_css_oldicons?' checked':''}><label for="on_css_oldicons">Старые иконки действий</label></div>
<div><input class="cwa-chk" id="on_css_maxopacity" type="checkbox"${globals.on_css_maxopacity?' checked':''}><label for="on_css_maxopacity">Все коты непрозрачные</label></div>
<div><input class="cwa-chk" id="on_css_highlightmove" type="checkbox"${globals.on_css_highlightmove?' checked':''}><label for="on_css_highlightmove">Подсветка переходов при наведении</label></div>
</div>`);
      $('body').on('change', '#on_treeTechies', function () {
        $('#cws_treeTechies').toggleClass('hidden');
      });
      $('body').on('change', '.cwa-chk', function () {
        let id = $(this).attr('id');
        let ischkd = $(this).prop('checked');
        if (ischkd) {
          $('head').append(css_texts[id]);
        }
        else {
          $('#cwsstyle_' + id).remove();
        }
        setSettings(id, ischkd);
      });
    }
  }

  function myCat() {
    if (!globals.charListArray.length) { //Если массив ни разу не заполнялся
      $(document).ready(function () {
        let autoCCArr = [];
        $('a[href*="/login2?"]').each(function () {
          let id = $(this).attr('href').split('=')[1];
          let name = $(this).html();
          if (id && name) {
            autoCCArr.push({
              'id': id,
              'name': name
            });
          }
        });
        let id = $('#pr a[href*="cat"] > b').html();
        let name = $('#pr > big').html();
        if (id && name) {
          autoCCArr.push({
            'id': id,
            'name': name
          });
        }
        window.localStorage.setItem('cws_sett_charListArray', JSON.stringify(autoCCArr));
      });
    }
  }

  function profile() {
      $.getJSON("https://abstract-shed.site/cwm_catalog/river_achievements.json?" + Date.now(), function (data) {
          const achievements = data
          , elem = `<div id="cws_achievement" style="display: none; margin: 5px; padding: 5px; border-radius: 10px; width: 270px; background: rgba(255, 255, 255, 0.3); color: black;"></div>`
          , inner = `Ачивка <b>"{name}"</b>
<span style="font-size: 0.9em"><br>Тип: <i>{type}</i><br>
<span style="white-space:pre-wrap">{condition}</span>`;
          let $achievement = $( (isDesktop ? '#branch' : '#site_table') + ' > .parsed tbody > tr:last-child img[src*="images.vfl.ru"]' )
          , $body = $('body')
          , old_code = "";
          $(document).ready(function() {
              $achievement.last().after(elem);
              $achievement.each(function(index) { // Добавить титул к каждой ачивке
                  let code = $(this).attr('src').match(/images.vfl.ru\/ii\/(\d+\/[\d\w]+\/\d+)\.png/);
                  if (code !== null) {
                      code = code[1];
                      let name = (achievements[code] === undefined) ? "Неизвестная ачивка" : achievements[code].name;
                      $(this).prop('title', name);
                  }
              });
              $achievement.on('click', function() { // инфоблок
                  let code = $(this).attr('src').match(/images.vfl.ru\/ii\/(\d+\/[\d\w]+\/\d+)\.png/);
                  if (code !== null) {
                      code = code[1];
                      if (code == old_code && $('#cws_achievement').css('display') != 'none') {
                          $('#cws_achievement').hide(200);
                      } else {
                          let this_achievement = (achievements[code] === undefined) ? {"name":"?", "type":"?", "condition":""} : achievements[code];
                          let info = inner
                          .replace("{name}", this_achievement.name)
                          .replace("{type}", this_achievement.type)
                          .replace("{condition}", this_achievement.condition);
                          $('#cws_achievement').html(info).show(200);
                          old_code = code;
                      }
                  }
              });
          });
      });
  }

  function dm() { //ЛС игрока
    if (globals.on_idDM) {
      $(document).ready(function () {
        $('#main').bind("DOMSubtreeModified", function () {
          if (!$('#cws_msg_id').length) {
            let id = $('#msg_login').attr('href');
            if (id !== undefined) {
              id = id.replace(/\D/ig, '');
              $('<i id=cws_msg_id> [' + id + ']</i>').insertAfter($('#msg_login'));
            }
          }
        });
      });
    }
  }

  function hunt() {
    if (!isDesktop) {
      if (globals.on_huntMobileBtns) {
      addCSS(`#select_type:after {
	content: " (переверните телефон на бок)";
	font-style: italic;
}
#select_type {
	width: 80%;
	margin-left: 10%;
	margin-top: 5%;
	text-align: center;
}
input {
	left: 5%;
	width: 90%;
}
#cws_buttons {
	position: absolute;
	top: 10px;
	left: 0px;
}
.mod_btn {
  position: absolute;
  z-index: 9999;
  font-family: Verdana;
  font-size: 2.5em;
  height: 1.5em;
  width: 1.5em;
  border-radius: 5em;
  background-size: 75% !important;
  background: #333 center no-repeat;
  color: white;
  opacity: .8;
  bottom:0;right:0;
  user-select: none;
  text-align: center;
  -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
#w_btn {
  top: 0em;
  left: 2.25em;
  background-image: url('https://i.imgur.com/y0e39Ai.png');
}
#d_btn {
  top: 2.3em;
  left: 4.25em;
  background-image: url('https://i.imgur.com/g6WcMvn.png');
}
#a_btn {
  top: 2.3em;
  left: .25em;
  background-image: url('https://i.imgur.com/JgywWPS.png');
}
#s_btn {
  top: 4.6em;
  left: 2.25em;
  background-image: url('https://i.imgur.com/BPRewfC.png');
}
#q_btn {
  top: .7em;
  left: .75em;
  background-image: url('https://i.imgur.com/JgywWPS.png');
}
#e_btn {
  top: .7em;
  left: 3.75em;
  background-image: url('https://i.imgur.com/y0e39Ai.png');
}
#z_btn {
  top: 3.9em;
  left: .75em;
  background-image: url('https://i.imgur.com/BPRewfC.png');
}
#x_btn {
  top: 3.9em;
  left: 3.75em;
  background-image: url('https://i.imgur.com/g6WcMvn.png');
}
#q_btn, #e_btn, #x_btn, #z_btn {transform: rotate(45deg);}
#oben, #links, #rechts, #unten {display: none;}`);
      $("#main").ready(function () {
        $("#main").append(`<div id="cws_buttons"><button class="mod_btn" data-code="81" id="q_btn"></button>
                                 <button class="mod_btn" data-code="87" id="w_btn"></button>
                                 <button class="mod_btn" data-code="69" id="e_btn"></button>
                                 <button class="mod_btn" data-code="65" id="a_btn"></button>
                                 <button class="mod_btn" data-code="83" id="s_btn"></button>
                                 <button class="mod_btn" data-code="68" id="d_btn"></button>
                                 <button class="mod_btn" data-code="90" id="z_btn"></button>
                                 <button class="mod_btn" data-code="88" id="x_btn"></button></div>`);
        $('.mod_btn').on("mousedown touchstart", function (e) {
          e.preventDefault();
          let code = $(this).data('code');
          $('#main').trigger(
            jQuery.Event('keydown', {
              keyCode: code,
              which: code
            })
          );
        });
        $('.mod_btn').on("mouseup touchend", function (e) {
          e.preventDefault();
          let code = $(this).data('code');
          $('#main').trigger(
            jQuery.Event('keyup', {
              keyCode: code,
              which: code
            })
          );
        });
      });
     }
        if (globals.on_huntMobileFix) {
        addCSS(`body {
	position: fixed;
	height: 100%;
	width: 100%;
	transform: scale(.8);
}
html {
	height: 100%;
	width: 100%;
}
#smell {
	position: absolute;
	bottom: calc(10px - 10%);
	left: -10%;
}
#cws_buttons {
    position: absolute;
    top: calc(10px - 12.5%);
    left: -12.5%;
    transform: scale(.9);
}`);
        }
    }

    if (globals.on_huntText) {
      addCSS(`#smell {
                     text-align: center;
                     display:flex;
                     flex-direction: column;
                     align-items:center;
                     justify-content:center;
                 }
                 #cws_hunt_txt {
                     background-color: white;
height: 2.3em;
                 }
#cws_timer, #cws_hunt_txt {width: 100%;}`);

      let color_old = -1;
      setInterval(function () {
        if ($('#smell').attr('style')) {
          if (!$('#cws_hunt_txt').length) {$('#smell').append('<div id=cws_timer data-sec=0 style="background-color: #ffffff;">00:00</div><div id=cws_hunt_txt></div>')}
          let color_new = parseInt($('#smell').css('background-color').split('(').pop().split(',')[0]);
          let a = color_new - color_old
          if (color_old != -1) {
            let text = (a < 0) ? "Дальше" : "Ближе";
            if (color_new === 0) text = "Слишком далеко";
            if ((a !== 0) || (color_new === 0 && !$('#cws_hunt_txt').html())) $('#cws_hunt_txt').html(text);
          }
          color_old = color_new;
        }
      }, 100);
      setInterval(function () {
        if ($('#cws_timer').length) {
          let sec = parseInt($('#cws_timer').data('sec'))
          , min;
          $('#cws_timer').data('sec', ++sec);
          min = parseInt(sec / 60);
          sec = sec - min*60;
          $('#cws_timer').text(leadZero(min) + ':' + leadZero(sec));
        }
      }, 1000);
    }
  }

  function blog() {
    if (globals.on_reports) {
      const blogID = pageurl.replace(/\D/g, '');
      const convert = `<hr>
<div>
  <p>Конвертация имён в айди</p>
  <textarea style="width:100%;resize:vertical;" rows="3" id="cws_convert_txt" placeholder="Гриволап, Шерстехвостка, Синяя Звезда"></textarea>
  <input type="submit" id="cws_convert" value="Получить айди">
  <div id="cws_convert_res"></div>
</div>`;
      $('body').on('click', '#cws_convert', function (e) {
        e.preventDefault();
        $("#cws_convert_res").html('');
        if ($('#cws_convert_txt').val().trim().length) {
          let arr = $('#cws_convert_txt').val().replace(/\n/g, "\n|").trim().split(/,|\n|:|;/)
          , string = ""
          , name_array = {};
          $.each(arr, function (key, value) {
            let new_str = value.trim().toLowerCase().replace(/^[а-яё]/ig, function (txtVal) {
              return txtVal.toUpperCase();
            }).replace(/ [а-яё]/ig, function (txtVal) {
              return txtVal.toUpperCase();
            });
            let str = '';
            if (name_array[new_str] === undefined) {
                $.ajax({
                    type: "POST",
                    url: "/ajax/top_cat",
                    data: {name: new_str},
                    async: false,
                    success: function (data) {
                        const id = parseInt(data, 10);
                        str = (isNaN(id)) ? new_str : id;
                        name_array[new_str] = str;
                        str += ' ';
                    }
                });
            } else {
                str = name_array[new_str] + ' ';
            }
            $("#cws_convert_res").append(str.replace(/\|/ig, '<br>'));
          });
        }
      });

      function masking(catID, maskStr) {
        return maskStr.replace(/%ID%/g, catID);
      }

      function toMaskedArr(str, maskStr) {
        str = str.replace(/\n/g, ' ');
        let tmp_arr = [];
        let error = false;
        let array = str.trim().split(' ');
        if (str.length) {
          $.each(array, function (key, value) {
            if (parseInt(value) == value) {
              tmp_arr.push(masking(value, maskStr));
            }
            else if (value !== "") {
              error = true;
            }
          });
        }
        let res = {};
        res.array = tmp_arr;
        res.error = error;
        return res;
      }

      function validateTextarea($textarea) {
        let pattern = new RegExp('^' + $textarea.attr('pattern') + '$');
        return $textarea.val().match(pattern);
      }

      function splitDateStr(datestr) {
        if (datestr) {
          let dt = {};
          let arr = datestr.split('-'); //yyyy-MM-dd
          dt.shortYear = arr[0].substring(2);
          dt.year = arr[0];
          dt.month = arr[1];
          dt.day = arr[2];
          return dt;
        }
        else {
          return false;
        }
      }
      if (blogID == '13664') {
        $(document).ready(function () {
          const date = new Date();
          const date_str = date.getFullYear() + '-' + leadZero(date.getMonth() + 1) + '-' + leadZero(date.getDate());
          const date_hr = leadZero(date.getHours());
          const form = `<hr>
<form id="rep_form">
<div>
    Отчёт по:
    <input class="cws-switch cws-input" type="radio" checked name="type" id="type_1" value="doz" data-id="rep_type" data-show="doz"><label for="type_1">Дозору</label>
    <input class="cws-switch cws-input" type="radio" name="type" id="type_2" value="patr" data-id="rep_type" data-show="patr"><label for="type_2">Патрулю</label>
</div>
<div class="cws-switch-obj" data-id="rep_type" data-show="doz">
    <p class="view-title">Дозор</p>
    Вид дозора:
    <select id="doz_type">
        <option>Пассивный (Камышовые заросли)</option>
        <option>Пассивный (Травянистый берег)</option>
        <option>Пассивный (Разрушенная ограда)</option>
        <option>Пассивный (Редколесье)</option>
        <option>Пассивный (Расколотое дерево)</option>
        <option>Пассивный (Лесной ручеёк)</option>
        <option>Пассивный (Туннель)</option>
        <option>Активный (1 маршрут)</option>
        <option>Активный (2 маршрут)</option>
        <option>Активный (3 маршрут)</option>
    </select>
</div>
<div class="cws-switch-obj" style="display:none;" data-id="rep_type" data-show="patr">
    <p class="view-title">Патруль</p>
    Маршрут:
    <input type="radio" class="cws-input" name="mar" id="m_1" required-switch value="1"><label for="m_1">1</label>
    <input type="radio" class="cws-input" name="mar" id="m_2" required-switch value="2"><label for="m_2">2</label>
</div>
<table>
    <tr><td>Дата начала:</td><td><input type="date" class="cws-input" id="cws_date" required value="${date_str}"></td><td></td></tr>
    <tr><td>Время начала:</td><td><input type="time" class="cws-input" id="cws_time" required value="${date_hr}:00" step="3600"></td><td></td></tr>
    <tr><td>Ваш ID:</td><td><input type="text" class="cws-input" pattern="[0-9]+" style="width: 145px;" id="cws_myid" required="true" placeholder="123456" value="${globals.my_id ? globals.my_id : ''}"></td><td><input type="checkbox" checked id="remember_id"><label for="remember_id">Запомнить</label></td></tr>
</table>
<div>
    ID участников, <b>исключая</b> вас, числами <small><i>(через пробел. Если их не было - оставьте поле пустым)</i></small>:
    <textarea style="width:95%;resize:none;" class="cws-input" pattern="[0-9 ]*" id="cws_allid" placeholder="123456 111111 222222 333333"></textarea>
</div>
<input type="submit" value="Заполнить отчет">
</form>`;
          $('#send_comment').append(form);
          $('#send_comment').append(convert);
          $('#rep_form').on('submit', function (e) {
            e.preventDefault();
            if ($(this).find('.cws-input:not(:valid)').length || !validateTextarea($(this).find('textarea'))) return;
            let myid = parseInt($('#cws_myid').val());
            if ($('#remember_id').prop('checked') && !isNaN(myid) && myid) {
              window.localStorage.setItem('cws_sett_my_id', myid);
            }
            let txt = '';
            let date = splitDateStr($("#cws_date").val());
            let hr = parseInt($("#cws_time").val().split(":")[0]);
            if ($(this).find('.cws-input[name=type]:checked').val() == 'doz') { //дозор
              let nextHr = (hr == 23) ? 0 : hr + 1;
              let type = $('#doz_type').val();
              hr = leadZero(hr);
              nextHr = leadZero(nextHr);
              let ids = $('#cws_myid').val() + ' ' + $('#cws_allid').val();
              let list = toMaskedArr(ids, "[cat%ID%] [%ID%]");
              txt = `[b]Дата:[/b] ${date.day}.${date.month};
[b]Время:[/b] ${hr}:00-${nextHr}:00;
[b]Участники:[/b] ${list.array.join(', ')};
[b]Вид дозора:[/b] ${type}.`;
            }
            else { //патр
              hr = leadZero(hr);
              let leader = masking($('#cws_myid').val().trim(), "[cat%ID%] [%ID%]");
              let mar = $(this).find('.cws-input[name=mar]:checked').val();
              let list = toMaskedArr($('#cws_allid').val(), "[cat%ID%] [%ID%]");
              txt = `[b]Дата и время:[/b] ${date.day}.${date.month}, ${hr}:00;
[b]Маршрут:[/b] ${mar};
[b]Ведущий:[/b] ${leader};
[b]Участники:[/b] ${list.array.join(', ')};`;
            }
            let val = $('#comment').val();
            if (val) {
              val += "\n\n";
            }
            $('#comment').val(val + txt);
          });
          $('.cws-switch').on('change', function () {
            let data_show = $(this).attr('data-show');
            let data_id = $(this).attr('data-id');
            let $show = $('.cws-switch-obj[data-show=' + data_show + ']');
            $('.cws-switch-obj[data-id=' + data_id + ']').not($show).slideUp();
            $('.cws-switch-obj[data-id=' + data_id + '] .cws-input[required-switch]').not($show).prop('required', false);
            $show.slideDown();
            $show.find('.cws-input[required-switch]').prop('required', true);
          });
        });
      }
      if (blogID == '15935 ///') {
        const form = `<hr>
<form id="rep_form">
<div>
    Отчёт по:
    <input class="cws-switch cws-input" type="radio" checked name="type" id="type_1" value="doz" data-id="rep_type" data-show="doz"><label for="type_1">Дозору</label>
    <input class="cws-switch cws-input" type="radio" name="type" id="type_2" value="patr" data-id="rep_type" data-show="patr"><label for="type_2">Патрулю</label>
</div>
<div class="cws-switch-obj" data-id="rep_type" data-show="doz">
    <p class="view-title">Дозор</p>
    Вид дозора:
    <select id="doz_type">
        <option>Пассивный (Камышовые заросли)</option>
        <option>Пассивный (Травянистый берег)</option>
        <option>Пассивный (Разрушенная ограда)</option>
        <option>Пассивный (Редколесье)</option>
        <option>Пассивный (Расколотое дерево)</option>
        <option>Пассивный (Лесной ручеёк)</option>
        <option>Пассивный (Туннель)</option>
        <option>Активный (1 маршрут)</option>
        <option>Активный (2 маршрут)</option>
        <option>Активный (3 маршрут)</option>
    </select>
</div>
<div class="cws-switch-obj" style="display:none;" data-id="rep_type" data-show="patr">
    <p class="view-title">Патруль</p>
    Маршрут:
    <input type="radio" class="cws-input" name="mar" id="m_1" required-switch value="1"><label for="m_1">1</label>
    <input type="radio" class="cws-input" name="mar" id="m_2" required-switch value="2"><label for="m_2">2</label>
</div>
<table>
    <tr><td>Ваш ID:</td><td><input type="text" class="cws-input" pattern="[0-9]+" style="width: 145px;" id="cws_myid" required="true" placeholder="123456" value="${globals.my_id ? globals.my_id : ''}"></td><td><input type="checkbox" checked id="remember_id"><label for="remember_id">Запомнить</label></td></tr>
</table>
<div>
    ID участников, <b>исключая</b> вас, числами <small><i>(через пробел. Если их не было - оставьте поле пустым)</i></small>:
    <textarea style="width:95%;resize:none;" class="cws-input" pattern="[0-9 ]*" id="cws_allid" placeholder="123456 111111 222222 333333"></textarea>
</div>
<input type="submit" value="Заполнить отчет">
</form>`;
        //$('#send_comment').append(form);
        $('#send_comment').append(convert);
      }
    }
  }

  function cumoves() {
    const notes = getSettings('cuMovesNote') || '';
    const p = `<p>Заметки:<br><textarea id="cws_moves_note" placeholder="Заметки о добавленных переходах" style="width: 95%; max-width: 830px; height: 100px; margin: 0px;"></textarea></p>`;
    $(p).insertBefore($('#text')); //text
    $('#cws_moves_note').val(notes);
    $('#cws_moves_note').on('input', function () {
      setSettings('cuMovesNote', $(this).val());
    });
  }

  function sett() {
    $('head').append(`<style id="css_cellshade_example">#cages td {box-shadow: inset 0px ${globals.css_cellshadeOpacity}px 0px ${globals.css_cellshadeOpacity}px ${globals.css_cellshadeColor};}</style>`);
      const pattern = globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':'';
    let css_coloredparam_example = `#dream td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}`;
    $('head').append(`<style id="css_coloredparam_example">${css_coloredparam_example}</style>`);
    let action_group_dis = (globals.on_actNotif) ? '' : ' disabled',
    tf_group_dis = (globals.on_teamFights) ? '' : ' disabled',
    clean_group_dis = (globals.on_cleanerHistory) ? '' : ' disabled',
    tt_dis = (globals.on_treeTechies) ? '' : ' disabled',
    cc_group_dis = (globals.on_charChange) ? '' : ' disabled',
    chatment_group_dis = (globals.on_chatMention) ? '' : ' disabled',
    nick_group_dis = (globals.on_nickHighlight) ? '' : ' disabled',
    css_cp_group_dis = (globals.on_css_coloredparam) ? '' : ' disabled',
    CCArray = '';
    $.each(globals.charListArray, function (index, obj) {
      if (obj.id && obj.name) {
        CCArray += `<tr><td><input class="cc-id" min=0 pattern="[0-9]{1,7}" type="number" group="char-change" value="${obj.id}" ${cc_group_dis}></td>
                        <td><input class="cc-name" maxlength="30" group="char-change" type="text" value="${obj.name}" ${cc_group_dis}></td>
                        <td><span class="cc-delete">×</span></td></tr>`;
      }
    });
    if (!CCArray.length) {
      CCArray = `<tr><td><input class="cc-id" min=0 pattern="[0-9]{1,7}" type="number" group="char-change" ${cc_group_dis}></td>
                    <td><input class="cc-name" maxlength="30" group="char-change" type="text" ${cc_group_dis}></td>
                    <td><span class="cc-delete">×</span></td></tr>`;
    }
    let nickArray = '';
    $.each(globals.nickListArray, function (index, obj) {
      if (obj) {
        nickArray += `<tr><td><input class="nick-name" maxlength="30" minlength="2" group="nick-highlight" placeholder="имя" type="text" value="${obj}" ${nick_group_dis}></td>
                        <td><span class="cc-delete">×</span></td></tr>`;
      }
    });
    if (!nickArray.length) {
      nickArray = `<tr><td><input class="nick-name" maxlength="30" minlength="2" group="nick-highlight" type="text"${nick_group_dis}></td>
                   <td><span class="cc-delete">×</span></td></tr>`;
    }
    let $body = $('body');
    addCSS(`.cp-color-pick, .team-color-pick {
	background-color: #eaeaea;
	border: 1px solid #b3b3b3;
}
.bl_in{
  display: inline-block;
  margin-left:20px;
}
#cwa_sett > div {
  margin: .6em 0;
}
#color_pick td, #color_pick th{
padding: .1em .25em;
}
.cat_box {
    padding: .6em .3em;
	width: fit-content;
}
#fight_bg {
border-radius: 1em;
background: url(https://abstract-shed.site/pic/background.png) top center no-repeat;
width: 320px;
height: 330px;
max-width: calc(100% - 1.2em);
}
.color-pick-wrapper {
    display: inline-block;
    width: 100px;
}
.cat_box {
margin:auto;
}
.arrow {
    height: 8px;
    position: absolute;
    margin: 0;
    padding: 3px 0 0 11px;
    z-index: 2;
}
.arrow-paws {background: url(/cw3/symbole/arrow_paws.png) 0 0 no-repeat;}
.arrow-claws {background: url(/cw3/symbole/arrow_claws.png) 0 0 no-repeat;}
.arrow-teeth {background: url(/cw3/symbole/arrow_teeth.png) 0 0 no-repeat;}
.arrow table, .arrow td {
    height: 5px !important;
    padding: 0;
    margin: 0;
}
.arrow_red {
    background: #CD4141;
}
.d, .d div {
    width: 100px;
    height: 150px;
}
table {
    border-collapse: collapse;
}
.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 1em;
  background: #622906;
  cursor: pointer;
}
.custom-range {
-webkit-appearance: none;
appearance: none;
width: 180px;
height: 15px;
background: #fff1dc;
outline: none;
border-style: solid;
border-width: 1px;
border-color: #62290640;
}
.custom-range::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #622906;
  cursor: pointer;
}
.cws-tbl-bordered, .cws-tbl-bordered td, .cws-tbl-bordered th {
  border: 1px solid #97663b70;
}
#action_table td, #action_table th, #charChangeTbl th{
  padding: 0 .5em;
}
.cc-delete {
  cursor: pointer;
  font-weight: bold;
  padding: 0 .1em;
  font-size: 1.2em;
}
.cc-name {
  width: 220px;
}
.cc-id {
  width: 80px;
}
@media(max-width:500px){/*smol*/
  #CCTbl tr > :first-child, .cc-id {
    width: 60px;
  }
  .cc-name {
    width: 98.5%;
  }
  #CCTbl tr > :last-child, .cc-delete {
    width: 19px;
  }
  #CCTbl {
    width: 100%;
  }
}
button {
    background-color: #333;
    color: #fff;
    border: 1px solid #000;
    font-family: Verdana;
    font-size: .9em;
}
button:disabled {
    background-color: #fff6e996;
  border-color: rgba(240,240,240,0.5);
}
.volume-table td:first-child {
  vertical-align: top;
  padding-top:3px;
}
#CCAdd, #nickAdd {
  margin-top: .25em;
}
#cm_blocked {
font-size: inherit; font-family:inherit;
resize:none;
width:99%;
height:50px;}
@media(max-width:500px){/*smol*/
#cm_blocked {
height:90px;}
}
.css-pic-url-example, #cages_div {
width:200px;
height:200px;
-moz-background-size: 100%;
    -webkit-background-size: 100%;
    -o-background-size: 100%;
    background-size: 100%;
background-color:black;
}
#cages {
width:200px;
height:200px;
}
.tt-page-name {width:50px;}
.css-pic-text {width:250px; max-width:100%;}
.parameter, .parameter td {
    margin: 0;
    padding: 0;
    border-spacing: 0;
}
.parameter {
    border: 1px solid black;
    width: 150px;
    height: 15px;
}
.symbole {
    width: 15px;
    height: 15px;
    background: url(/cw3/symbole/icons.png) no-repeat;
    padding: 0;
    margin: 0;
}
#parameters_block {
  width: 185px;
display:inline-block;
margin-top:5px;
}
.tt-folders-names {
  width: 130px;
}`);
    const html = `<hr><hr><div id="cwa_sett"><h2>Настройки CW:Shed</h2>
<div><i><small>! Большинство изменений применяются автоматически. Для того, чтобы изменения вступили в силу, обновите Игровую (страницу с ЛС, профиль).</small></i></div>
<h3>Дополнительная информация</h3>
    <div><input class="cwa-chk" id="on_idDM" type="checkbox"${globals.on_idDM?' checked':''}><label for="on_idDM">Включить отображение ID в личных сообщениях</label></div>
    <div><input class="cwa-chk" id="on_idCatMouth" type="checkbox"${globals.on_idCatMouth?' checked':''}><label for="on_idCatMouth">Включить отображение ID котов, находящихся во рту</label></div>
    <div><input class="cwa-chk" id="on_idItemMouth" type="checkbox"${globals.on_idItemMouth?' checked':''}><label for="on_idItemMouth">Включить отображение ID и названий предметов, находящихся во рту</label></div>
    <div><input class="cwa-chk" id="on_idChat" type="checkbox"${globals.on_idChat?' checked':''}><label for="on_idChat">Включить отображение ID в чате Игровой</label></div>
    <div><input class="cwa-chk" id="on_paramInfo" type="checkbox"${globals.on_paramInfo?' checked':''}><label for="on_paramInfo">Информация о параметре при нажатии на иконку</label></div>
    <div><input class="cwa-chk" id="on_cuMovesNote" type="checkbox"${globals.on_cuMovesNote?' checked':''}><label for="on_cuMovesNote">[ВТ] Заметки на странице добавления/удаления переходов</label></div>
<h3>Уведомления</h3>
    <div><input class="cwa-chk" id="on_newDM" type="checkbox"${globals.on_newDM?' checked':''}><label for="on_newDM">Уведомлять о новом ЛС, когда я в Игровой</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_newDM" id="sound_newDM" value="${globals.sound_newDM}"></td>
        <td><button data-bind="sound_newDM" sound-src="${sounds.new_message}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk" id="on_newChat" type="checkbox"${globals.on_newChat?' checked':''}><label for="on_newChat">Уведомлять о новом сообщении в Чате, когда я в Игровой</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_newChat" id="sound_newChat" value="${globals.sound_newChat}"></td>
        <td><button data-bind="sound_newChat" sound-src="${sounds.new_message}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk group-switch" id="on_nickHighlight" group-header="nick-highlight" type="checkbox"${globals.on_nickHighlight?' checked':''}><label for="on_nickHighlight">Выделять следующие строчки как моё имя в Игровой</label></div>
<form id="nickForm">
<table border=1 id="nickTbl">
<thead><th>Кличка</th><th></th></thead>
<tbody id="nickList">
${nickArray}
</tbody>
</table>
</form>
<button id="nickAdd" group="nick-highlight"${nick_group_dis}>Добавить новое поле</button>
<div><button group="nick-highlight" form="nickForm"${nick_group_dis}>Сохранить</button></div>
<div><b>*</b> Из-за того, как устроен чат на Варе, эта функция может добавлять лагов, особенно когда за несколько секунд приходит много сообщений. Чем больше Вы установите себе кличек, тем большая будет нагрузка.</div>
    <div><input class="cwa-chk group-switch" id="on_chatMention" group-header="chat-mention" type="checkbox"${globals.on_chatMention?' checked':''}><label for="on_chatMention">Уведомлять, когда моё имя упоминают в чате Игровой</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_chatMention" id="sound_chatMention" value="${globals.sound_chatMention}"></td>
        <td><button data-bind="sound_chatMention" sound-src="${sounds.chat_mention}" class="sound-test">Тест</button></td>
    </tr></table>
    <div>Айди персонажей, от которых игнорировать уведомления (<i>через пробел</i>):</div>
<form id="form_cm_blocked">
    <textarea id="cm_blocked" group="chat-mention" ${chatment_group_dis} pattern="[0-9 ]+" placeholder="420020 930302">${globals.cm_blocked.join(' ')}</textarea>
<button group="chat-mention" ${chatment_group_dis}>Запомнить</button>
</form>
    <hr>
    <div><input class="cwa-chk" id="notif_eaten" type="checkbox"${globals.notif_eaten?' checked':''}><label for="notif_eaten">Уведомлять, если меня кто-то поднял</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_notifEaten" id="sound_notifEaten" value="${globals.sound_notifEaten}"></td>
        <td><button data-bind="sound_notifEaten" sound-src="${sounds.action_notif}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk" id="notif_attack" type="checkbox"${globals.notif_attack?' checked':''}><label for="notif_attack">Уведомлять, если меня ввели в боевую стойку через Т+2 или Т+3</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_notifBeaten" id="sound_notifBeaten" value="${globals.sound_notifBeaten}"></td>
        <td><button data-bind="sound_notifBeaten" sound-src="${sounds.alert_attacked}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk group-switch" id="on_actNotif" group-header="action-notif" type="checkbox"${globals.on_actNotif?' checked':''}><label for="on_actNotif">Уведомлять об окончании действий</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_notifEndAct" id="sound_notifEndAct" value="${globals.sound_notifEndAct}"></td>
        <td><button data-bind="sound_notifEndAct" sound-src="${sounds.action_notif}" class="sound-test">Тест</button></td>
    </tr></table>
    <div style="font-size: 12px"><b>На которые действия реагировать:</b></div>
<block class="bl_in">
<table id="action_table" class="cws-tbl-bordered" border=1>
<thead><th>Текст</th><th>Звук</th><th>Описание</th></thead>
<tbody>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_move" type="checkbox"${globals.txt_act_move?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_move" type="checkbox"${globals.snd_act_move?' checked':''}></td>
    <td>Переход (дольше 5 секунд)</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_rub" type="checkbox"${globals.txt_act_rub?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_rub" type="checkbox"${globals.snd_act_rub?' checked':''}></td>
    <td>Поедание дичи</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_need" type="checkbox"${globals.txt_act_need?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_need" type="checkbox"${globals.snd_act_need?' checked':''}></td>
    <td>Пополнение нужды</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_drink" type="checkbox"${globals.txt_act_drink?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_drink" type="checkbox"${globals.snd_act_drink?' checked':''}></td>
    <td>Питьё</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_dig" type="checkbox"${globals.txt_act_dig?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_dig" type="checkbox"${globals.snd_act_dig?' checked':''}></td>
    <td>Копание</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_digin" type="checkbox"${globals.txt_act_digin?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_digin" type="checkbox"${globals.snd_act_digin?' checked':''}></td>
    <td>Закапывание</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_clean" type="checkbox"${globals.txt_act_clean?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_clean" type="checkbox"${globals.snd_act_clean?' checked':''}></td>
    <td>Вылизывание</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_sleep" type="checkbox"${globals.txt_act_sleep?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_sleep" type="checkbox"${globals.snd_act_sleep?' checked':''}></td>
    <td>Сон</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_sniff" type="checkbox"${globals.txt_act_sniff?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_sniff" type="checkbox"${globals.snd_act_sniff?' checked':''}></td>
    <td>Нюх</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_swim" type="checkbox"${globals.txt_act_swim?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_swim" type="checkbox"${globals.snd_act_swim?' checked':''}></td>
    <td>Плавание</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_fill_moss" type="checkbox"${globals.txt_act_fill_moss?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_fill_moss" type="checkbox"${globals.snd_act_fill_moss?' checked':''}></td>
    <td>Наполнение мха водой</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_murr" type="checkbox"${globals.txt_act_murr?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_murr" type="checkbox"${globals.snd_act_murr?' checked':''}></td>
    <td>Мурлыкание</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_tails" type="checkbox"${globals.txt_act_tails?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_tails" type="checkbox"${globals.snd_act_tails?' checked':''}></td>
    <td>Переплетание хвостов</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_cheek" type="checkbox"${globals.txt_act_cheek?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_cheek" type="checkbox"${globals.snd_act_cheek?' checked':''}></td>
    <td>Трение щёками</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_ground" type="checkbox"${globals.txt_act_ground?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_ground" type="checkbox"${globals.snd_act_ground?' checked':''}></td>
    <td>Валяние по земле</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_rub" type="checkbox"${globals.txt_act_rub?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_rub" type="checkbox"${globals.snd_act_rub?' checked':''}></td>
    <td>Трение носами</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_calm" type="checkbox"${globals.txt_act_calm?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_calm" type="checkbox"${globals.snd_act_calm?' checked':''}></td>
    <td>Выход из боевой стойки</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_watch" type="checkbox"${globals.txt_act_watch?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_watch" type="checkbox"${globals.snd_act_watch?' checked':''}></td>
    <td>Осмотр окрестностей</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_marking" type="checkbox"${globals.txt_act_marking?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_marking" type="checkbox"${globals.snd_act_marking?' checked':''}></td>
    <td>Пометка территории</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_clawscratch" type="checkbox"${globals.txt_act_clawscratch?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_clawscratch" type="checkbox"${globals.snd_act_clawscratch?' checked':''}></td>
    <td>Затачивание когтей</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_rug" type="checkbox"${globals.txt_act_rug?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_rug" type="checkbox"${globals.snd_act_rug?' checked':''}></td>
    <td>Чистка ковра</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_attention" type="checkbox"${globals.txt_act_attention?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_attention" type="checkbox"${globals.snd_act_attention?' checked':''}></td>
    <td>Привлечение внимания</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_domestsleep" type="checkbox"${globals.txt_act_domestsleep?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_domestsleep" type="checkbox"${globals.snd_act_domestsleep?' checked':''}></td>
    <td>Сон в лежанке</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_checkup" type="checkbox"${globals.txt_act_checkup?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_checkup" type="checkbox"${globals.snd_act_checkup?' checked':''}></td>
    <td>Осмотр целителя</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_loottr" type="checkbox"${globals.txt_act_loottr?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_loottr" type="checkbox"${globals.snd_act_loottr?' checked':''}></td>
    <td>Осмотр дупла (дерево)</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_lootcr" type="checkbox"${globals.txt_act_lootcr?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_lootcr" type="checkbox"${globals.snd_act_lootcr?' checked':''}></td>
    <td>Осмотр расщелины (скала)</td>
</tr>
</tbody>
</table>
</block>
<div><input class="cwa-chk" id="on_smellTimer" group-header="smell-timer" type="checkbox"${globals.on_smellTimer?' checked':''}><label for="on_smellTimer">Таймер времени до следующего нюха вверху страницы Игровой (рядом с Мой кот / Чат / ЛС)</label></div>
<block class="bl_in">
<div><input class="cwa-chk" id="on_smellTimerNotif" group="smell-timer" type="checkbox"${globals.on_smellTimerNotif?' checked':''}><label for="on_smellTimerNotif">Уведомлять, когда таймер истечёт</label></div>
<table><tr>
    <td>Громкость:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_smellTimer" id="sound_smellTimer" value="${globals.sound_smellTimer}"></td>
    <td><button data-bind="sound_smellTimer" sound-src="${sounds.action_notif}" class="sound-test">Тест</button></td>
</tr></table>
</block>
<h3>Бои</h3>
<div>Высота окошка лога боережима (конфликтует с варомодом. 70 = "выключено", значение по умолчанию): <input type=number id="fight_log_max_height" class="cws-number" min=50 max=500 value="${globals.fight_log_max_height}"> px</div>
<hr>
<div><input class="cwa-chk" id="on_blockNotif" type="checkbox"${globals.on_blockNotif?' checked':''}><label for="on_blockNotif">Уведомлять при нажатии/отжатии блока</label></div>
<table class="volume-table"><tr>
    <td>Громкость при нажатии:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_blockStart" id="sound_blockStart" value="${globals.sound_blockStart}"></td>
    <td><button data-bind="sound_blockStart" sound-src="${sounds.block_start}" class="sound-test">Тест</button></td>
</tr><tr>
    <td>Громкость при отжатии:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_blockEnd" id="sound_blockEnd" value="${globals.sound_blockEnd}"></td>
    <td><button data-bind="sound_blockEnd" sound-src="${sounds.block_end}" class="sound-test">Тест</button></td>
</tr></table>

<div><input class="cwa-chk" id="on_moveFightLog" type="checkbox"${globals.on_moveFightLog?' checked':''}><label for="on_moveFightLog">Возможность перетаскивать лог бр ("прицел" слева от замочка блокировки)</label></div>
<div><input class="cwa-chk" id="on_shortFightLog" type="checkbox"${globals.on_shortFightLog?' checked':''}><label for="on_shortFightLog">Сокращения повторяющихся ударов ("Я =&gt; Гривохвостик (лапы) (х4)")</label></div>

<div><input class="cwa-chk group-switch" id="on_teamFights" group-header="team-fights" type="checkbox"${globals.on_teamFights?' checked':''}><label for="on_teamFights">Команды в боевом режиме</label></div>
<div>
<div>Максимальная высота окошка с распределением команд: <input type=number id="tf_max_height" class="cws-number" group="team-fights" min=100 max=500 value="${globals.tf_max_height}"> px</div>
<table align=center id="color_pick" class="cws-tbl-bordered" border=1 style="text-align: center;">
<tr><th>Команда:</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
<tr><th>"Зелёный"</th>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat-1g id="tf_color_g_team1" value="${globals.tf_color_g_team1}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat0g id="tf_color_g_team2" value="${globals.tf_color_g_team2}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat1g id="tf_color_g_team3" value="${globals.tf_color_g_team3}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat2g id="tf_color_g_team4" value="${globals.tf_color_g_team4}"></td>
</tr>
<tr><th>"Красный"</th>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat-1r id="tf_color_r_team1" value="${globals.tf_color_r_team1}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat0r id="tf_color_r_team2" value="${globals.tf_color_r_team2}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat1r id="tf_color_r_team3" value="${globals.tf_color_r_team3}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat2r id="tf_color_r_team4" value="${globals.tf_color_r_team4}"></td>
</tr>
</table>
</div>
<div id=fight_bg style="margin: auto;">
<div class=cat_box>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-paws" style="top: 75px; transform: rotate(157deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 25px; background: ${globals.tf_color_r_team2};" data-bind=cat0r></td><td class="arrow-color" style="width: 25px; background: ${globals.tf_color_g_team2};" data-bind=cat0g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-shed.site/pic/catmodel1.png');" class="d"></div></span></div>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-teeth" style="top: 75px; transform: rotate(41deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 13px; background: ${globals.tf_color_r_team3};" data-bind=cat1r></td><td class="arrow-color" style="width: 37px; background: ${globals.tf_color_g_team3};" data-bind=cat1g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-shed.site/pic/catmodel2.png');" class="d"></div></span></div>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-claws" style="top: 75px; transform: rotate(378deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 19px; background: ${globals.tf_color_r_team4};" data-bind=cat2r></td><td class="arrow-color" style="width: 31px; background: ${globals.tf_color_g_team4};" data-bind=cat2g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-shed.site/pic/catmodel3.png');" class="d"></div></span></div>
</div>
<div class=cat_box>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-paws" style="top: 75px; transform: rotate(433deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 19px; background: ${globals.tf_color_r_team1};" data-bind=cat-1r></td><td class="arrow-color" style="width: 31px; background: ${globals.tf_color_g_team1};" data-bind=cat-1g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-shed.site/pic/catmodel-1.png');" class="d"></div></span></div>
</div>
</div>
<h3>Стили [by <a href="cat892248" target="_blank">Псих</a>]</h3>
<div><input class="cwa-chk" id="on_css_quicksettings" type="checkbox"${globals.on_css_quicksettings?' checked':''}><label for="on_css_quicksettings">Быстрая настройка самых необходимых стилей из Игровой (блок под Родственными связями)</label></div>
<!--
<div>
    <div>Цветовая тема:</div>
    <block class="bl_in">
        <div><input type=radio class="cwa-radio" name=css_theme ${globals.css_theme=='theme_classic'?'checked ':''}id="theme_classic"><label for="theme_classic">классическая</label></div>
        <div><input type=radio class="cwa-radio" name=css_theme ${globals.css_theme=='theme_dark'?'checked ':''} id="theme_dark"><label for="theme_dark">тёмная</label></div>
        <div><input type=radio class="cwa-radio" name=css_theme ${globals.css_theme=='theme_light'?'checked ':''} id="theme_light"><label for="theme_light">светлая</label></div>
    </block>
</div>
-->

<div><input class="cwa-chk" id="on_css_newloading" type="checkbox"${globals.on_css_newloading?' checked':''}><label for="on_css_newloading">Замена гифки загрузки на «...»</label></div>
<div><input class="cwa-chk" id="on_css_hideTooltip" type="checkbox"${globals.on_css_hideTooltip?' checked':''}><label for="on_css_hideTooltip">Скрыть всплывающее при наведении на кота окошко</label></div>
<div><input class="cwa-chk" id="on_css_daylight" type="checkbox"${globals.on_css_daylight?' checked':''}><label for="on_css_daylight">Всегда день в Игровой</label></div>
<div><input class="cwa-chk" id="on_css_removesky" type="checkbox"${globals.on_css_removesky?' checked':''}><label for="on_css_removesky">Убрать небо</label></div>
<div><input class="cwa-chk" id="on_css_oldicons" type="checkbox"${globals.on_css_oldicons?' checked':''}><label for="on_css_oldicons">Старые иконки действий</label></div>
<div><input class="cwa-chk" id="on_css_cellshade" type="checkbox"${globals.on_css_cellshade?' checked':''}><label for="on_css_cellshade">Сетка ячеек локации</label></div>
<div><block class="bl_in">
<table>
<tr><td>Цвет:</td>
<td><input type="color" class="css-cellshade color-pick" id="css_cellshadeColor" value="${globals.css_cellshadeColor}"></td></tr>
</table>

<table class="volume-table"><tr>
    <td>Непрозрачность:</td>
    <td><input type="range" class="css-cellshade custom-range" step="0.1" max="1" min="0.1" id="css_cellshadeOpacity" value="${globals.css_cellshadeOpacity}"></td>
</tr></table>

<div id="cages_div" style="background-image: url('cw3/spacoj/91.jpg');">
<table id="cages"><tbody>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody></table>
</div>


</block>
</div>
<!--

<div><input class="cwa-chk" id="on_css_bgpic" type="checkbox"${globals.on_css_bgpic?' checked':''}><label for="on_css_bgpic">Картинка на заднем плане Игровой</label></div>
<block class="bl_in">
<input type=text class="css-pic-text" id="css_bgpicURL" default="https://catwar.su/cw3/spacoj/0.jpg" value=${globals.css_bgpicURL}>
<div><button class="css-pic-url-apply" data-id="css_bgpicURL">Применить</button><button class="css-pic-url-reset" data-id="css_bgpicURL">Сбросить</button></div>
<div class="css-pic-url-example" data-id="css_bgpicURL" style="background-image:url('${globals.css_bgpicURL}');"></div>
</block>

-->
<div><input class="cwa-chk" id="on_csslocation" type="checkbox"${globals.on_csslocation?' checked':''}><label for="on_csslocation">Статичный фон на каждой локации:</label></div>
<block class="bl_in">
<input type=text class="css-pic-text" id="css_locURL" default="https://catwar.su/cw3/spacoj/170.jpg" value=${globals.css_locURL}>
<div><button class="css-pic-url-apply" data-id="css_locURL">Применить</button><button class="css-pic-url-reset" data-id="css_locURL">Сбросить</button></div>
<div class="css-pic-url-example" data-id="css_locURL" style="background-image:url('${globals.css_locURL}');"></div>
</block>
<div><input class="cwa-chk" id="on_css_highlightmove" type="checkbox"${globals.on_css_highlightmove?' checked':''}><label for="on_css_highlightmove">Подсветка переходов при наведении</label></div>
<div><input class="cwa-chk" id="on_css_maxopacity" type="checkbox"${globals.on_css_maxopacity?' checked':''}><label for="on_css_maxopacity">Все коты непрозрачные</label></div>

<div><input class="cwa-chk group-switch" id="on_css_coloredparam" group-header="css-cp" type="checkbox"${globals.on_css_coloredparam?' checked':''}><label for="on_css_coloredparam">Разноцветные параметры и навыки</label></div>
<block class="bl_in">
<div><input class="cwa-chk"${css_cp_group_dis} id="css_cp_pattern" group="css-cp" type="checkbox"${globals.css_cp_pattern?' checked':''}><label for="css_cp_pattern">Узор</label></div>
<div>В таблице ниже можно настроить каждый цвет по желанию. "Зелёный" означает заполненную, зелёную часть полоски, "Красный" - отсутствующую, красную (в случае с навыками - серую) часть полоски. Под каждой частью есть два цвета - левая и правая часть градиента. Если не хотите, чтобы был градиент - ставьте одинаковые цвета.</div>
<div style="display:inline-block; margin-top:5px;"><table class="cws-tbl-bordered">
<tr><th></th><th colspan=2>Зелёный</th><th colspan=2>Красный</th></tr>
<tr><td align=center>Сон</td>
<td align=right><input type="color" data-id="0" value="${globals.css_cp_colors[0]}" class="cp-color-pick"></td>
<td><input type="color" data-id="1" value="${globals.css_cp_colors[1]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="2" value="${globals.css_cp_colors[2]}" class="cp-color-pick"></td>
<td><input type="color" data-id="3" value="${globals.css_cp_colors[3]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Голод</td>
<td align=right><input type="color" data-id="4" value="${globals.css_cp_colors[4]}" class="cp-color-pick"></td>
<td><input type="color" data-id="5" value="${globals.css_cp_colors[5]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="6" value="${globals.css_cp_colors[6]}" class="cp-color-pick"></td>
<td><input type="color" data-id="7" value="${globals.css_cp_colors[7]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Жажда</td>
<td align=right><input type="color" data-id="8" value="${globals.css_cp_colors[8]}" class="cp-color-pick"></td>
<td><input type="color" data-id="9" value="${globals.css_cp_colors[9]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="10" value="${globals.css_cp_colors[10]}" class="cp-color-pick"></td>
<td><input type="color" data-id="11" value="${globals.css_cp_colors[11]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Нужда</td>
<td align=right><input type="color" data-id="12" value="${globals.css_cp_colors[12]}" class="cp-color-pick"></td>
<td><input type="color" data-id="13" value="${globals.css_cp_colors[13]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="14" value="${globals.css_cp_colors[14]}" class="cp-color-pick"></td>
<td><input type="color" data-id="15" value="${globals.css_cp_colors[15]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Здоровье</td>
<td align=right><input type="color" data-id="16" value="${globals.css_cp_colors[16]}" class="cp-color-pick"></td>
<td><input type="color" data-id="17" value="${globals.css_cp_colors[17]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="18" value="${globals.css_cp_colors[18]}" class="cp-color-pick"></td>
<td><input type="color" data-id="19" value="${globals.css_cp_colors[19]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Чистота</td>
<td align=right><input type="color" data-id="20" value="${globals.css_cp_colors[20]}" class="cp-color-pick"></td>
<td><input type="color" data-id="21" value="${globals.css_cp_colors[21]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="22" value="${globals.css_cp_colors[22]}" class="cp-color-pick"></td>
<td><input type="color" data-id="23" value="${globals.css_cp_colors[23]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Навыки</td>
<td align=right><input type="color" data-id="24" value="${globals.css_cp_colors[24]}" class="cp-color-pick"></td>
<td><input type="color" data-id="25" value="${globals.css_cp_colors[25]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="26" value="${globals.css_cp_colors[26]}" class="cp-color-pick"></td>
<td><input type="color" data-id="27" value="${globals.css_cp_colors[27]}" class="cp-color-pick"></td></tr></table></div>

<div id="parameters_block"><table id="dream_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -30px"></div></td><td><span id="dream">
<table class="parameter"><tbody><tr><td style="width: 75px;"></td><td style="width: 75px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -60px"></div></td><td><span id="hunger">
<table class="parameter"><tbody><tr><td style="width: 90px;"></td><td style="width: 60px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -15px"></div></td><td><span id="thirst">
<table class="parameter"><tbody><tr><td style="width: 45px;"></td><td style="width: 105px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -45px"></div></td><td><span id="need">
<table class="parameter"><tbody><tr><td style="width: 70px;"></td><td style="red; width: 80px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -90px"></div></td><td><span id="health">
<table class="parameter"><tbody><tr><td style="width: 80px;"></td><td style="red; width: 70px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -120px"></div></td><td><span id="clean">
<table class="parameter"><tbody><tr><td style="width: 75px;"></td><td style="red; width: 75px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<hr style="display:flex;">
<table id="smell_table"><tbody><tr><td><div class="symbole" id="smell_icon" style="background-position: 0px 0px"></div></td><td><span id="smell">
<table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:75px;"></td><td style="width:75px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table>
<table id="dig_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -105px"></div></td><td><span id="dig">
<table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:50px;"></td><td style="width:100px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table>
<table id="swim_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -135px"></div></td><td><span id="swim">
<table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:90px;"></td><td style="width:60px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table>
<table id="might_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -150px"></div></td><td><span id="might"><table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:70px;"></td><td style="width:80px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table></div>
<table>
<tr><td>Окошко для экспорта:</td><td><input type="text" value='${JSON.stringify(globals.css_cp_colors)}' id="css_cp_export"></td></tr>
<tr><td>Окошко для импорта:</td><td><input type="text" id="css_cp_import"></td></tr>
</table>
<button id="css_cp_import_btn">Импортировать</button>
</block>

<div id=circlewrap><div id=testcircle><div id=cblack></div><div></div></div></div>

<h3>Разное</h3>
<div><input class="cwa-chk" id="on_oldDialogue" type="checkbox"${globals.on_oldDialogue?' checked':''}><label for="on_oldDialogue">Старый вид диалогов с ботами (разворачивающийся список вместо прокрутки)</label></div>
<div><input class="cwa-chk group-switch" id="on_cleanerHistory" group-header="cleaner-log" type="checkbox"${globals.on_cleanerHistory?' checked':''}><label for="on_cleanerHistory">Лог деятельности в чистильщиках</label></div>
<div style="font-size: 12px"><b>Записывать</b></div>
<block class="bl_in">
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_id" type="checkbox"${globals.clean_id?' checked':''}><label for="clean_id">ID поднятого/опущенного</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_title" type="checkbox"${globals.clean_title?' checked':''}><label for="clean_title">Должность поднятого/опущенного</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_location" type="checkbox"${globals.clean_location?' checked':''}><label for="clean_location">Локацию, в которой кот был поднят/опущен</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_action" type="checkbox"${globals.clean_action?' checked':''}><label for="clean_action">Проверка на действие*.</label>
<div>* Работает так: отписывает вместе с <i>"Поднял кота..."</i> ещё и <i>"Проверил на действие кота по имени ..."</i>, но только И ТОЛЬКО при условии, что проверка была за два действия до поднятия (и между проверкой и поднятием не была перезагружена Игровая). Пример:
<ul>
    <li><i>"Потёрлись носом о нос с котом по имени Хвостогривик. Отменил действие. Поднял кота по имени Хвостогривик."</i> - засчитывается за проверку.</li>
    <li><i>"Потёрлись носом о нос с котом по имени Хвостогривик. Поднял кота по имени Хвостогривик."</i> - <b>не</b> засчитывается за проверку (проверка не была отменена).</li>
    <li><i>"Потёрлись носом о нос с котом по имени Лапкоусик. Отменил действие. Поднял кота по имени Хвостогривик."</i> - <b>не</b> засчитывается за проверку (проверка была на другом коте).</li>
    <li><i>"Потёрлись носом о нос с котом по имени Хвостогривик. Отменил действие. Обнюхал землю. Поднял кота по имени Хвостогривик."</i> - <b>не</b> засчитывается за проверку (проверка была слишком "давно").</li>
</ul>
</div>
</div></block>
<hr>
<div><input class="cwa-chk" id="on_huntText" type="checkbox"${globals.on_huntText?' checked':''}><label for="on_huntText">Охота: доп. информация в окошке с запахом</label></div>
<div><input class="cwa-chk" id="on_huntMobileBtns" type="checkbox"${globals.on_huntMobileBtns?' checked':''}><label for="on_huntMobileBtns">Охота: удобные кнопки на мобильных устройствах</label></div>
<div><input class="cwa-chk" id="on_huntMobileFix" type="checkbox"${globals.on_huntMobileFix?' checked':''}><label for="on_huntMobileFix">Охота: фикс "уезжающего" окна на маленьких мобильных устройствах</label></div>
<hr>
<div><input class="cwa-chk" id="on_catsDown" type="checkbox"${globals.on_catsDown?' checked':''}><label for="on_catsDown">Ставить котов внизу клетки (несовместимо с активными боями, т.к. не видно правильного места горла/шеи оппонента)</label></div>
<hr>
<div><input class="cwa-chk group-switch" id="on_charChange" group-header="char-change" type="checkbox"${globals.on_charChange?' checked':''}><label for="on_charChange">Отображение перехода на других персонажей в Игровой (рядом с Мой кот / Чат / ЛС)</label></div>
Включает переход на душевых/игровых персонажей, как в верхнем левом углу на сайте, прямо из Игровой. Первый раз список заполнится <b>автоматически</b>, если зайти на страницу "Мой кот/Моя кошка".
<form id="CCForm">
<table border=1 id="CCTbl" class="cws-tbl-bordered">
<thead><th>ID</th><th>Отображаемое имя</th><th></th></thead>
<tbody id="CCList">
${CCArray}
</tbody>
</table>
</form>
<button group="char-change" id="CCAdd"${cc_group_dis}>Добавить новое поле</button>
<div><button group="char-change" form="CCForm"${cc_group_dis}>Сохранить</button></div>
<hr>
<div><input class="cwa-chk group-switch" id="on_treeTechies" group-header="tree-techies" type="checkbox"${globals.on_treeTechies?' checked':''}><label for="on_treeTechies">Расчерчивание поля в отдельном окошке при каче ЛУ</label></div>
<block class="bl_in">
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_folded" type="checkbox"${globals.tt_folded?' checked':''}><label for="tt_folded">Изначально сворачивать окошко</label></div>
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_clean_confirm" type="checkbox"${globals.tt_clean_confirm?' checked':''}><label for="tt_clean_confirm">Запрашивать подтверждение при очистке поля</label></div>
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_show_volume" type="checkbox"${globals.tt_show_volume?' checked':''}><label for="tt_show_volume">Подпись громкости сообщений в чате от ботов (веток)</label></div>
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_dark_theme" type="checkbox"${globals.tt_dark_theme?' checked':''}><label for="tt_dark_theme">Тёмная раскраска окошка ЛУ</label></div>
<div>Положение окошка X:
<input type=number id="tt_window_left" class="cws-number" min=0 max=4096 value="${globals.tt_window_left}"> px,
Y: <input type=number id="tt_window_top" class="cws-number" min=0 max=9999 value="${globals.tt_window_top}"> px
<br>
<button id="tt_window_pos_def">Сбросить</button></div>

<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_notif_refresh" type="checkbox"${globals.tt_notif_refresh?' checked':''}><label for="tt_notif_refresh">Звук при смене карты локации</label></div>
<table><tr>
    <td>Громкость:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_ttRefresh" id="sound_ttRefresh" value="${globals.sound_ttRefresh}"></td>
    <td><button data-bind="sound_ttRefresh" sound-src="${sounds.tt_refresh}" class="sound-test">Тест</button></td>
</tr></table>

<div>Страницы:</div>
<block class="bl_in">
<div>[✓] Вкладка А</div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="0" value='${globals.tt_foldersnamesArray[0]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="0" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[0]}"${tt_dis}></td><td align="center">✓</td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="1" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[1]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="1" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[1]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="2" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[2]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="2" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[2]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="3" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[3]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="3" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[3]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="4" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[4]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="4" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[4]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="5" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[5]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="5" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[5]?' checked':''}></td></tr>
</tbody>
</table>
</block>
<div><input class="tt-folders-enabled" data-id="1" group="tree-techies"${tt_dis} id="tt_foldersenabledArray1" type="checkbox"${globals.tt_foldersenabledArray[1]?' checked':''}><label for="tt_foldersenabledArray1">Вкладка Б</label></div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="1" value='${globals.tt_foldersnamesArray[1]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="6" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[6]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="6" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[6]?' checked':''}></td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="7" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[7]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="7" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[7]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="8" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[8]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="8" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[8]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="9" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[9]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="9" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[9]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="10" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[10]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="10" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[10]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="11" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[11]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="11" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[11]?' checked':''}></td></tr>
</tbody>
</table>
</block>
<div><input class="tt-folders-enabled" data-id="2" group="tree-techies"${tt_dis} id="tt_foldersenabledArray2" type="checkbox"${globals.tt_foldersenabledArray[2]?' checked':''}><label for="tt_foldersenabledArray2">Вкладка В</label></div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="2" value='${globals.tt_foldersnamesArray[2]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="12" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[12]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="12" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[12]?' checked':''}></td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="13" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[13]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="13" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[13]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="14" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[14]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="14" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[14]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="15" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[15]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="15" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[15]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="16" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[16]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="16" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[16]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="17" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[17]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="17" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[17]?' checked':''}></td></tr>
</tbody>
</table>
</block>
<div><input class="tt-folders-enabled" data-id="3" group="tree-techies"${tt_dis} id="tt_foldersenabledArray3" type="checkbox"${globals.tt_foldersenabledArray[3]?' checked':''}><label for="tt_foldersenabledArray3">Вкладка Г</label></div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="3" value='${globals.tt_foldersnamesArray[3]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="18" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[18]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="18" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[18]?' checked':''}></td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="19" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[19]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="19" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[19]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="20" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[20]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="20" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[20]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="21" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[21]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="21" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[21]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="22" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[22]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="22" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[22]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="23" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[23]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="23" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[23]?' checked':''}></td></tr>
</tbody>
</table>
</block>
</block>
</block>
<hr>
<div><input class="cwa-chk" id="on_reports" type="checkbox"${globals.on_reports?' checked':''}><label for="on_reports">Тестовая штука: Автоматическое составление отчётов в Блоге Охраняющих Границы (только для Речного племени)</label></div>
<p align=right><i>Текущая версия CW:Shed: ${version}</i></p>
</div>
<hr><hr>`;
    $(isDesktop ? '#branch' : '#site_table').append(html);
    $body.on('click', '#css_cp_import_btn', function () {
      let val = $('#css_cp_import').val();
      let match = val.match(/\["#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}"\]/);
      if (match) {
        globals.css_cp_colors = JSON.parse(val);
        setSettings('css_cp_colors', val);
        $('#css_cp_export').val(val);
        for (let i = 0; i < 28; i++) {
          $('.cp-color-pick[data-id=' + i + ']').val(globals.css_cp_colors[i]);
        }
        css_coloredparam_example = `#dream td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}`;
        $('#css_coloredparam_example').html(css_coloredparam_example);
      }
      else {
        alert('Неверный формат импорта');
      }
    })
    $body.on('change', '.cp-color-pick', function () {
      let id = $(this).data('id');
      let val = $(this).val();
      globals.css_cp_colors[id] = val;
      setSettings('css_cp_colors', JSON.stringify(globals.css_cp_colors));
      $('#css_cp_export').val(JSON.stringify(globals.css_cp_colors));
      css_coloredparam_example = `#dream td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}`;
      $('#css_coloredparam_example').html(css_coloredparam_example);
    });
    $body.on('change', '.tt-folders-enabled', function () {
      let ischkd = $(this).prop('checked');
      let folder_num = parseInt($(this).data('id'));
      //console.log(globals.tt_foldersenabledArray)
      globals.tt_foldersenabledArray[folder_num] = ischkd;
      //console.log(globals.tt_foldersenabledArray)
      setSettings('tt_foldersenabledArray', JSON.stringify(globals.tt_foldersenabledArray));
    });
    $body.on('change paste focusout keyup', '.tt-page-name', function () {
      let val = $(this).val();
      let page_num = parseInt($(this).data('id'));
      if (val) {
        globals.tt_pagenamesArray[page_num] = val;
        setSettings('tt_pagenamesArray', JSON.stringify(globals.tt_pagenamesArray));
      }
    });
    $body.on('change paste focusout keyup', '.tt-folders-names', function () {
      let val = $(this).val();
      let folder_num = parseInt($(this).data('id'));
      if (val) {
        globals.tt_foldersnamesArray[folder_num] = val;
        setSettings('tt_foldersnamesArray', JSON.stringify(globals.tt_foldersnamesArray));
      }
    });
    $body.on('change', '.cwa-chk-tt-page', function () {
      let id = $(this).attr('id'),
        page_num = parseInt($(this).data('id')),
        ischkd = $(this).prop('checked');
      globals.tt_pageenabledArray[page_num] = ischkd;
      setSettings('tt_pageenabledArray', JSON.stringify(globals.tt_pageenabledArray));
    });
    $body.on('change', '#css_cp_pattern', function () {
      let ischkd = $(this).prop('checked');
      let style = $('#css_coloredparam_example').html();
      if (ischkd) {
        style = style.replace(/background:/g, 'background:url(https://i.imgur.com/V4TX5Cv.png), ');
      }
      else {
        style = style.replace(/url\([^\)]+\), /g, '');
      }
      $('#css_coloredparam_example').html(style);
    });
    $body.on('submit', '#nickForm', function (e) {
      e.preventDefault();
      let nickArr = [];
      $('#nickList > tr').each(function () {
        let name = $(this).find('.nick-name').val();
        if (name) {
          nickArr.push(name);
        }
      });
      setSettings('nickListArray', JSON.stringify(nickArr));
    });
    $body.on('submit', '#CCForm', function (e) {
      e.preventDefault(); /* 4111 */
      let CCArr = [];
      $('#CCList > tr').each(function () {
        let id = $(this).find('.cc-id').val();
        let name = $(this).find('.cc-name').val();
        if (id && name) {
          CCArr.push({
            'id': id,
            'name': name
          });
        }
      });
      setSettings('charListArray', JSON.stringify(CCArr));
    });
    $body.on('submit', '#form_cm_blocked', function (e) {
      e.preventDefault();
      let arr = $('#cm_blocked').val().split(' ');
      $.each(arr, function (index, value) {
        arr[index] = parseInt(value.trim());
      });
      arr = jQuery.grep(arr, function (a) {
        return a; //Оставить только числа и не 0
      });
      setSettings('cm_blocked', JSON.stringify(arr));
    });
    $body.on('click', '#CCAdd', function () {
      if ($('.cc-id').length < 5) {
        $('#CCList').append(`<tr><td><input class="cc-id" min=0 pattern="[0-9]{1,7}" type="number"></td><td><input class="cc-name" maxlength="30" type="text"></td><td><span class="cc-delete">×</span></td></tr>`);
      }
    });
    $body.on('click', '#nickAdd', function () {
      if ($('.nick-name').length < 3) {
        $('#nickList').append(`<tr><td><input class="nick-name" maxlength="30" minlength="2" group="char-change" type="text"></td><td><span class="cc-delete">×</span></td></tr>`);
      }
    });
    $body.on('click', '#tt_window_pos_def', function () {
      $('#tt_window_left,#tt_window_top').val(20);
      setSettings('tt_window_left', 20);
      setSettings('tt_window_top', 20);
    });
    $body.on('click', '.cc-delete', function () {
      if ($(this).closest('tbody').find('tr').length != 1) {
        $(this).closest('tr').remove();
      }
    });
    let audio = new Audio();
    $body.on('click', '.sound-test', function () {
      audio.pause();
      audio.currentTime = 0;
      audio.src = $(this).attr('sound-src');
      audio.volume = $('.custom-range[data-bind=' + $(this).attr('data-bind') + ']').val();
      audio.play();
    });
    $body.on('change', '.custom-range', function () {
      let volume = $(this).val();
      let id = $(this).attr('id');
      window.localStorage.setItem('cws_sett_' + id, volume);
      globals[id] = volume;
    });
    $body.on('change', '.cwa-chk', function () {
      let id = $(this).attr('id');
      let ischkd = $(this).prop('checked');
      setSettings(id, ischkd);
      globals[id] = ischkd;
    });
    $body.on('change paste focusout keyup', '.cws-number', function () {
      let val = parseInt($(this).val());
      if (val >= $(this).attr('min') && val <= $(this).attr('max')) {
        setSettings($(this).attr('id'), val);
      }
    });
    $body.on('change', '.group-switch', function () {
      let group = $(this).attr('group-header');
      let ischkd = $(this).prop('checked');
      $(':input[group=' + group + '], button[group=' + group + ']').prop('disabled', !ischkd);
    });
    $body.on('change', '.team-color-pick', function () {
      let val = $(this).val();
      $('.arrow-color[data-bind=' + $(this).data('bind') + ']').css('background', val);
    });
    $body.on('change', '.color-pick', function () {
      let val = $(this).val();
      setSettings($(this).attr('id'), val);
    });
    $body.on('click', '.css-pic-url-apply', function () {
      let pic_id = $(this).data("id");
      let val = $('#' + pic_id).val();
      setSettings(pic_id, val);
      $('.css-pic-url-example[data-id=' + pic_id + ']').css("background-image", "url('" + val + "')");
    });
    $body.on('click', '.css-pic-url-reset', function () {
      let pic_id = $(this).data("id");
      let def = $('#' + pic_id).attr('default');
      removeSettings(pic_id);
      $('#' + pic_id).val(def);
      $('.css-pic-url-example[data-id=' + pic_id + ']').css("background-image", "url('" + def + "')");
    });
    $body.on('change', '#css_cellshadeColor', function () {
      let val = $(this).val();
      let html = $('#css_cellshade_example').html().replace(/ #[\dA-Fa-f]{6}/, ' ' + val);
      $('#css_cellshade_example').html(html);
    });
    $body.on('change', '#css_cellshadeOpacity', function () {
      let val = $(this).val();
      let html = $('#css_cellshade_example').html().replace(/0px [0-9\.]+px 0px [0-9\.]+px/, '0px ' + val + 'px 0px ' + val + 'px');
      $('#css_cellshade_example').html(html);
    });
  }
})(window, document, jQuery);
