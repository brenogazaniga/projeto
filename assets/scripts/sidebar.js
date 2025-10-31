document.addEventListener('DOMContentLoaded', function() {
    const logoToggle = document.getElementById('logo-toggle');
    const sidebar = document.getElementById('barra-lateral');
    logoToggle.addEventListener('click', function() {
        if (window.innerWidth <= 2000) {
            sidebar.classList.toggle('show'); 
        }
    });
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !logoToggle.contains(event.target) && window.innerWidth <= 992) {
            sidebar.classList.remove('show');
        }
    });
});
