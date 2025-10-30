
function openApp(url) {
  window.location.href = url;
}
function openWidget(url) {
  window.location.href = url;
}
const rotateBtn = document.getElementById('rotateBtn');
const wrapper = document.querySelector('.phone-rotate-wrapper');
const box = wrapper.querySelector('.box');

rotateBtn.addEventListener('click', () => {
    wrapper.classList.toggle('rotated');
    if (wrapper.classList.contains('rotated')) {
        rotateBtn.textContent = '↺ Rotate Back';
    } else {
        rotateBtn.textContent = '↻ Rotate Phone';
    }
});