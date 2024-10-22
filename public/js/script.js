document.addEventListener('DOMContentLoaded', function() {
    // Remove any lingering backdrops
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.remove();
    });

    // Initialize modal
    const newCaseModal = document.getElementById('newCaseModal');
    if (newCaseModal) {
        const modal = new bootstrap.Modal(newCaseModal, {
            backdrop: 'static',
            keyboard: false
        });

        // Handle modal show
        newCaseModal.addEventListener('show.bs.modal', function () {
            document.body.classList.add('modal-open');
        });

        // Handle modal hide
        newCaseModal.addEventListener('hide.bs.modal', function () {
            document.body.classList.remove('modal-open');
        });

        // Handle form submission
        const form = document.getElementById('newCaseForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Your form handling logic here
                modal.hide();
            });
        }
    }
});