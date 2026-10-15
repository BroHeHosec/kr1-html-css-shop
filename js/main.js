// ============================================
// 1. Модальное окно и форма в модалке
// ============================================

const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  const orderButtons = document.querySelectorAll('.product-card__button, [data-open-order]');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const orderForm = document.getElementById('order-form');
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

      if (orderForm) {
        orderForm.querySelectorAll('[aria-invalid]').forEach((field) => {
          field.setAttribute('aria-invalid', 'false');
        });
      }
      if (successMessage) {
        successMessage.hidden = true;
      }

      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }

      orderDialog.showModal();

      // Переводим фокус на первое поле ввода — так удобнее для клавиатуры.
      const firstInput = orderForm && orderForm.querySelector('input:not([type="hidden"])');
      if (firstInput) {
        firstInput.focus({ preventScroll: true });
      }
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

      // Сбрасываем предыдущие признаки ошибок.
      formElements.forEach((element) => {
        if (element.willValidate) {
          element.setAttribute('aria-invalid', 'false');
        }
      });

      // Проверяем форму.
      if (!orderForm.checkValidity()) {
        let firstInvalidField = null;

        formElements.forEach((element) => {
          if (element.willValidate && !element.checkValidity()) {
            element.setAttribute('aria-invalid', 'true');
            if (!firstInvalidField) {
              firstInvalidField = element;
            }
          }
        });

        // Фокус — на первое невалидное поле.
        if (firstInvalidField) {
          firstInvalidField.focus();
        }

        orderForm.reportValidity();
        return;
      }

      // Успех.
      if (successMessage) {
        successMessage.hidden = false;
      }

      orderForm.reset();

      // После reset возвращаем aria-invalid="false" на всех полях.
      formElements.forEach((element) => {
        if (element.willValidate) {
          element.setAttribute('aria-invalid', 'false');
        }
      });

      orderDialog.close();
    });
  }
}


// ============================================
// 2. Форма на отдельной странице order.html
// ============================================

const orderPageForm = document.getElementById('order-form-page');
const successMessagePage = document.getElementById('success-message-page');

if (orderPageForm) {
  orderPageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const pageFormElements = Array.from(orderPageForm.elements);

    pageFormElements.forEach((element) => {
      if (element.willValidate) {
        element.setAttribute('aria-invalid', 'false');
      }
    });

    if (successMessagePage) {
      successMessagePage.hidden = true;
    }

    if (!orderPageForm.checkValidity()) {
      let firstInvalidField = null;

      pageFormElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
          if (!firstInvalidField) {
            firstInvalidField = element;
          }
        }
      });

      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      orderPageForm.reportValidity();
      return;
    }

    if (successMessagePage) {
      successMessagePage.hidden = false;
    }

    orderPageForm.reset();

    pageFormElements.forEach((element) => {
      if (element.willValidate) {
        element.setAttribute('aria-invalid', 'false');
      }
    });
  });
}


// ============================================
// 3. Кнопка «Наверх»
// ============================================

const toTopButton = document.querySelector('.to-top');

if (toTopButton) {
  const toggleToTopVisibility = () => {
    if (window.scrollY > 300) {
      toTopButton.hidden = false;
      toTopButton.classList.add('to-top--visible');
    } else {
      toTopButton.classList.remove('to-top--visible');
      window.setTimeout(() => {
        if (window.scrollY <= 300) {
          toTopButton.hidden = true;
        }
      }, 220);
    }
  };

  window.addEventListener('scroll', toggleToTopVisibility, { passive: true });
  toggleToTopVisibility();

  toTopButton.addEventListener('click', () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  });
}