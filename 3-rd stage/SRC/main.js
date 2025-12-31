import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

import { DateTime } from 'luxon';

document.getElementById('showTimeBtn').addEventListener('click', function() {
    const now = DateTime.now();
    const formattedDateTime = now.setLocale('ru').toLocaleString({
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('currentDateTime').textContent = formattedDateTime;
    
    const modal = new Modal(document.getElementById('timeModal'));
    modal.show();
});