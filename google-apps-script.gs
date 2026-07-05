/**
 * Приём заявок с сайта partner.trust-leads.ru в Google-таблицу.
 *
 * Установка (нужна ОТДЕЛЬНАЯ, новая Google-таблица — не та, что для других сайтов):
 *  1. Создайте Google-таблицу: в браузере откройте https://sheets.new
 *  2. Меню «Расширения» → «Apps Script».
 *  3. Удалите весь код в файле Code.gs и вставьте этот.
 *  4. Сохраните (значок дискеты).
 *  5. «Развернуть» → «Новое развёртывание» → шестерёнка → тип «Веб-приложение».
 *       • Описание: любое (напр. «Заявки partner»)
 *       • Запуск от имени: Я (ваш аккаунт)
 *       • У кого есть доступ: «Все» (Anyone)
 *     Нажмите «Развернуть», при первом запуске разрешите доступ к аккаунту.
 *  6. Скопируйте «URL веб-приложения» (заканчивается на /exec).
 *  7. Вставьте этот URL в web-partner/index.html → CONFIG.formEndpoint.
 *
 * Заявки будут падать строками в таблицу. Первая строка — заголовки (создаётся автоматически).
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата', 'Имя', 'Фамилия', 'Телефон', 'Телеграм']);
    }
    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.surname || '',
      p.phone || '',
      p.telegram || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Проверка, что веб-приложение живо (откройте /exec в браузере — увидите OK).
function doGet() {
  return ContentService.createTextOutput('OK');
}
