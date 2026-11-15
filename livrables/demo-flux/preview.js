export function showName(output, name) {
  output.textContent = name;
}

const form = document.querySelector('#preview-form');
const nameField = document.querySelector('#name');
const output = document.querySelector('#preview');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  showName(output, nameField.value);
});
showName(output, nameField.value);
