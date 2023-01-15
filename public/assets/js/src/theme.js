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
    element.style.width = `${this.scrollY/(document.body.scrollHeight - window.innerHeight - 80)*100}%`;
});