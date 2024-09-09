//! FETCH PRODUCT DATA FROM STRIPE
const stripeData = {};
// console.log(import.meta.env.ADMIN_USERNAME);
const portal = document.createElement('div');
portal.setAttribute('id', 'admin-portal');
portal.innerHTML = 'HOME';

const headerForm = document.createElement('form');
headerForm.setAttribute('method', 'POST');

const headerError = document.createElement('p');

const headerInput = document.createElement('input')


form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const response = await fetch(`/admin/api/portal${window.location.pathname}`, {
		method: 'POST',
		body: new FormData(form),
	});

	if (response.ok) {
		// window.location.href = '/';
	} else {
		error.innerText = (await response.json()).error;
	}
});

document.body.appendChild(portal);
