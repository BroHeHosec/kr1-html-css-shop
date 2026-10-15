// ============================================
// 1. Модальное окно и форма в модалке
// ============================================
// Этот блок выполняется только на страницах,
// где есть <dialog id="order-dialog">.
// На order.html модалки нет — блок просто пропустится.

const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  // Кнопки заказа в карточках и общая кнопка «Оставить заявку».
  const orderButtons = document.querySelectorAll('.product-card__button, [data-open-order]');

  // Кнопка закрытия модального окна.
  const closeDialogButton = document.getElementById('close-order-dialog');

  // Скрытое поле, в которое записывается выбранный товар.
  const selectedProductInput = document.getElementById('selected-product');

  // Форма заявки внутри модалки.
  const orderForm = document.getElementById('order-form');

  // Сообщение об успешной отправке (обычно на главной).
  const successMessage = document.getElementById('success-message');

  // Клик по свободному месту модалки снимает выбор поля.
  orderDialog.addEventListener('click', (event) => {
    if (!event.target.closest('input, select, textarea, label, button')) {
      const title = document.getElementById('order-dialog-title');
      if (title) {
        title.focus({ preventScroll: true });
      }
    }
  });

  // Открытие модалки по кнопкам.
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product || '';

      // Убираем ошибки от предыдущей попытки заполнения.
      if (orderForm) {
        orderForm.querySelectorAll('[aria-invalid]').forEach((field) => {
          field.removeAttribute('aria-invalid');
        });
      }
      if (successMessage) {
        successMessage.hidden = true;
      }

      // Записываем название товара в скрытое поле.
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }

      orderDialog.showModal();
    });
  });

  // Закрытие модалки по кнопке «Закрыть».
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Обработка отправки формы в модалке.
  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formElements = Array.from(orderForm.elements);

      formElements.forEach((element) => {
        if (element.willValidate) {
          element.removeAttribute('aria-invalid');
        }
      });

      if (!orderForm.checkValidity()) {
        formElements.forEach((element) => {
          if (element.willValidate && !element.checkValidity()) {
            element.setAttribute('aria-invalid', 'true');
          }
        });
        orderForm.reportValidity();
        return;
      }

      if (successMessage) {
        successMessage.hidden = false;
      }

      orderForm.reset();
      orderDialog.close();
    });
  }
}


// ============================================
// 2. Форма на отдельной странице order.html
// ============================================
// Выполняется только если на странице есть
// <form id="order-form-page">.

const orderPageForm = document.getElementById('order-form-page');
const successMessagePage = document.getElementById('success-message-page');

if (orderPageForm) {
  orderPageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const pageFormElements = Array.from(orderPageForm.elements);

    pageFormElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (successMessagePage) {
      successMessagePage.hidden = true;
    }

    if (!orderPageForm.checkValidity()) {
      pageFormElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderPageForm.reportValidity();
      return;
    }

    if (successMessagePage) {
      successMessagePage.hidden = false;
    }

    orderPageForm.reset();
  });
}