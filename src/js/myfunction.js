import $ from "jquery";

let links = document.querySelectorAll('a');
let background = document.querySelector('.link-background')


const clickHandler = (el) => {
    links.forEach(link => {
        link.classList.remove('active');
    })
    el.classList.add('active');
}
links.forEach((link,index) => {
    link.addEventListener('click',(e) => {
        e.preventDefault();
        // Update background position
        background.style.transform = `translateX(${128.25 * index}%)`
        clickHandler(e.currentTarget);
        
    });
})