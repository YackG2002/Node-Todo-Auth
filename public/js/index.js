document.addEventListener("DOMContentLoaded", function() {

    function updateTitle(title) {
        document.getElementById('currentTitle').innerText = title;
    }

    var links = document.querySelectorAll('.sidebar ul li a');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            updateTitle(this.innerText);


            links.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');

            localStorage.setItem('activeLink', this.id);

        });
    });

    updateTitle('Workspace');

    /*function handleSidebarLinkClick(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien

        // Cache toutes les sections de l'espace de travail
        var workspaceSections = document.querySelectorAll('.workspace');
        workspaceSections.forEach(function(section) {
            section.style.display = 'none';
        });

        // Rend la section correspondante visible
        var targetSectionId = event.target.getAttribute('id'); // Obtient l'ID du lien cliqué
        var targetSection = document.getElementById(targetSectionId); // Trouve l'élément avec cet ID
        if (targetSection) {
            targetSection.style.display = 'block'; // Affiche la section
        }
    }

    links.forEach(function(link) {
        link.addEventListener('click', handleSidebarLinkClick);
    });*/
});