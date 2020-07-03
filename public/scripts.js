const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');

for (let card of cards) {
    card.addEventListener('click', function() {
        modalOverlay.classList.add('active');
        const pageId = card.getAttribute("id");

        modalOverlay.querySelector("iframe").src = `https://rocketseat.com.br/${pageId}`;
    });
}

document.querySelector('.maximize-modal').addEventListener('click', function() {
    const modalMaximize = modalOverlay.querySelector('.modal').classList.contains('maximize');

    if (modalMaximize) {
        modalOverlay.querySelector('.modal').classList.remove("maximize");
    } else {
        modalOverlay.querySelector('.modal').classList.add("maximize");
    }    
});

document.querySelector('.close-modal').addEventListener('click', function() {
    modalOverlay.classList.remove("active");
    modalOverlay.querySelector("iframe").src = "";
});


