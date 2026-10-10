const form = document.querySelector('#chat-form');
const input = document.querySelector('#question');
const sendButton = document.querySelector('#send-button');
const resetButton = document.querySelector('#reset-button');
const messages = document.querySelector('#messages');
const dogImage = document.querySelector('#dog-image');
const dogCaption = document.querySelector('#dog-caption');
const dogImages = {
  welcome: { src: '/static/Welcome.png', alt: 'Your dog helper is ready to chat', caption: 'Ready to chat!' },
  thinking: { src: '/static/Thinking.png', alt: 'Your dog helper is thinking', caption: 'Thinking it through…' },
  done: { src: '/static/Done.png', alt: 'Your dog helper has an answer', caption: 'All done!' },
};
const welcomeText = 'Hi there! I’m your friendly chat helper. What would you like to learn about today?';

function setDog(state) {
  const image = dogImages[state];
  dogImage.src = image.src;
  dogImage.alt = image.alt;
  dogCaption.textContent = image.caption;
}

function addMessage(kind, text, extraClass = '') {
  const article = document.createElement('article');
  article.className = `message ${kind}-message ${extraClass}`.trim();
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = kind === 'user' ? 'You' : '🐶';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  bubble.append(paragraph);
  article.append(avatar, bubble);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
  return article;
}

resetButton.addEventListener('click', () => {
  if (sendButton.disabled) return;
  messages.replaceChildren();
  addMessage('assistant', welcomeText, 'welcome-message');
  input.value = '';
  input.style.height = 'auto';
  setDog('welcome');
  input.focus();
});

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question || sendButton.disabled) return;

  addMessage('user', question);
  input.value = '';
  input.style.height = 'auto';
  sendButton.disabled = true;
  resetButton.disabled = true;
  setDog('thinking');
  const thinking = addMessage('assistant', 'Hmm, let me think about that…', 'typing');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    thinking.remove();
    if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    addMessage('assistant', data.answer);
    setDog('done');
  } catch (error) {
    thinking.remove();
    addMessage('assistant', error.message || 'I couldn’t find an answer just now. Please try again.');
    setDog('welcome');
  } finally {
    sendButton.disabled = false;
    resetButton.disabled = false;
    input.focus();
  }
});
