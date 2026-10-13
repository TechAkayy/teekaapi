import { errors, services } from '../content/booking';

const root = document.querySelector<HTMLElement>('[data-booking-preview]');
if (root) initialize(root);

function initialize(root: HTMLElement): void {
  const controls = root.querySelector<HTMLElement>('[data-preview-controls]');
  const fallback = root.querySelector<HTMLElement>('[data-preview-fallback]');
  const steps = [...root.querySelectorAll<HTMLElement>('[data-preview-step]')];
  const progress = [...root.querySelectorAll<HTMLElement>('[data-progress-step]')];
  const date = root.querySelector<HTMLInputElement>('#preview-date');
  const time = root.querySelector<HTMLInputElement>('#preview-time');
  const radios = [...root.querySelectorAll<HTMLInputElement>('[name="preview-service"]')];
  const dateError = root.querySelector<HTMLElement>('#preview-date-error');
  const timeError = root.querySelector<HTMLElement>('#preview-time-error');
  const serviceError = root.querySelector<HTMLElement>('#preview-service-error');
  const review = root.querySelector<HTMLElement>('[data-preview-review]');
  const result = root.querySelector<HTMLElement>('[data-preview-result]');
  const reviewDate = root.querySelector<HTMLElement>('[data-review-date]');
  const reviewTime = root.querySelector<HTMLElement>('[data-review-time]');
  const reviewService = root.querySelector<HTMLElement>('[data-review-service]');
  const finish = root.querySelector<HTMLButtonElement>('[data-finish]');
  const restart = root.querySelector<HTMLButtonElement>('[data-reset]');
  if (!controls || !fallback || !date || !time || !dateError || !timeError || !serviceError || steps.length !== 3 || progress.length !== 3 || radios.length !== 2) return;
  if (!review || !result || !reviewDate || !reviewTime || !reviewService || !finish || !restart) return;

  let current = 0;
  const today = (): string => {
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const part = (type: string) => parts.find((item) => item.type === type)!.value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  };
  const showStep = (index: number, focus = true): void => {
    current = index;
    steps.forEach((step, i) => { step.hidden = i !== index; });
    progress.forEach((item, i) => {
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    if (focus) steps[index].querySelector('h2')?.focus();
  };
  const setError = (input: HTMLInputElement, output: HTMLElement, message: string): void => {
    output.textContent = message;
    output.hidden = !message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };
  const validateDate = (): boolean => {
    date.min = today();
    const message = date.validity.rangeUnderflow ? errors.pastDate : !date.value || !date.validity.valid ? errors.date : '';
    setError(date, dateError, message);
    return !message;
  };
  const validateTime = (): boolean => {
    const message = !time.value || !time.validity.valid ? errors.time : '';
    setError(time, timeError, message);
    return !message;
  };
  const validateService = (): boolean => {
    const valid = radios.some((radio) => radio.checked);
    serviceError.textContent = valid ? '' : errors.service;
    serviceError.hidden = valid;
    radios.forEach((radio) => {
      if (valid) radio.removeAttribute('aria-invalid');
      else radio.setAttribute('aria-invalid', 'true');
    });
    return valid;
  };
  const validateDateTime = (): boolean => {
    const dateValid = validateDate();
    const timeValid = validateTime();
    if (dateValid && timeValid) return true;
    showStep(0, false);
    (dateValid ? time : date).focus();
    return false;
  };
  const reset = (focus = true): void => {
    date.value = '';
    time.value = '';
    date.min = today();
    radios.forEach((radio) => { radio.checked = false; radio.removeAttribute('aria-invalid'); });
    setError(date, dateError, '');
    setError(time, timeError, '');
    serviceError.textContent = '';
    serviceError.hidden = true;
    reviewDate.textContent = '';
    reviewTime.textContent = '';
    reviewService.textContent = '';
    review.hidden = false;
    result.hidden = true;
    showStep(0, focus);
  };
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-next]')) {
    button.addEventListener('click', () => {
      if (current > 1 || !validateDateTime()) return;
      if (current === 1 && !validateService()) { radios[0].focus(); return; }
      if (current === 1) {
        reviewDate.textContent = new Intl.DateTimeFormat('en-AU', { timeZone: 'UTC', dateStyle: 'long' }).format(date.valueAsDate!);
        reviewTime.textContent = time.value;
        reviewService.textContent = services.find((service) => service.value === radios.find((radio) => radio.checked)?.value)!.label;
      }
      showStep(current + 1);
    });
  }
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-back]')) {
    button.addEventListener('click', () => { if (current > 0) showStep(current - 1); });
  }
  finish.addEventListener('click', () => {
    if (current !== 2 || !result.hidden || !validateDateTime()) return;
    review.hidden = true;
    result.hidden = false;
    result.querySelector('h2')?.focus();
  });
  restart.addEventListener('click', () => reset());
  date.addEventListener('input', () => { if (!dateError.hidden) validateDate(); });
  time.addEventListener('input', () => { if (!timeError.hidden) validateTime(); });
  radios.forEach((radio) => radio.addEventListener('change', validateService));
  reset(false);
  // Clear native history restoration too; choices never survive a new page visit.
  window.addEventListener('pageshow', () => reset(false));
  fallback.hidden = true;
  controls.hidden = false;
}
