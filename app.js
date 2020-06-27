// fires when the initial HTML document completely loaded
document.addEventListener('DOMContentLoaded', () => {

    buildGrid();

})

function buildGrid() {
    let grid = document.getElementById("grid");
    for(let i = 0; i < 200; i++) {
        let div = document.createElement("div");
        grid.appendChild(div);
    }
}