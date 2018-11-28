var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var div_main = document.getElementById('div_main');
var button_solo = document.getElementById('button_solo');
var button_battle = document.getElementById('button_battle');
var button_explain = document.getElementById('button_explain');

function attachButtonListener() {

    button_solo.addEventListener('click', function (event) {
        div_main.style.display = 'none';
        // TODO
    });

    button_battle.addEventListener('click', function (event) {
        div_main.style.display = 'none';
        // TODO
    });

    button_explain.addEventListener('click', function (event) {
        // TODO
    });
}



window.onload = function () {
    // TODO
    attachButtonListener();
};