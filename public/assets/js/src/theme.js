const smoothScroll = (() => {
    let selector = '[data-scroll]',
    fixedHeader = '[data-scroll-header]',
    scroll = new SmoothScroll(selector, {
      speed: 800,
      speedAsDuration: true,
      offset: (anchor, toggle) => {
        return toggle.dataset.scrollOffset || 40;
      },
      header: fixedHeader,
      updateURL: false
    });
  
})();

window.addEventListener("scroll", (event) => {
    const element = document.querySelector('.header-scroll div');
    element.style.width = `${this.scrollY/(document.body.scrollHeight - window.innerHeight)*100}%`;
});

const formValidation = (() => {

  const selector = 'needs-validation';

  window.addEventListener('load', () => {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.getElementsByClassName(selector);
    // Loop over them and prevent submission
    let validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (e) => {
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();