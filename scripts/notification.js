function showNotification() {
    const toastLiveExample = document.getElementById('liveToast');
    if (toastLiveExample) {
        const toast = new bootstrap.Toast(toastLiveExample);
        setTimeout(() => {
            toast.show();
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const targetElement = document.getElementById('available-tutors-section');
    let toastShown = false;

    document.addEventListener('scroll', () => {
        if (!toastShown) {
            const rect = targetElement.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                showNotification();
                toastShown = true;
            }
        }
    });

    const toastElement = document.getElementById('liveToast');
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastShown = true;
    });
});