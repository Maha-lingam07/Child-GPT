const form = document.querySelector('#chat-form');
const input = document.querySelector('#question');
const sendButton = document.querySelector('#send-button');
const resetButton = document.querySelector('#reset-button');
const micButton = document.querySelector('#mic-button');
const speechStatus = document.querySelector('#speech-status');
const messages = document.querySelector('#messages');
const dogImage = document.querySelector('#dog-image');
const dogCaption = document.querySelector('#dog-caption');
const dogImages = {
  welcome: { src: '/static/Welcome.png', alt: 'Your dog helper is ready to chat', caption: 'Ready to chat!' },
  thinking: { src: '/static/Thinking.png', alt: 'Your dog helper is thinking', caption: 'Thinking it through…' },
  done: { src: '/static/Done.png', alt: 'Your dog helper has an answer', caption: 'All done!' },
};
const welcomeText = 'Hi there! I’m your friendly chat helper. What would you like to learn about today?';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;
let recognizedText = '';

if (!SpeechRecognition) {
  micButton.disabled = true;
  micButton.title = 'Speech input is not supported in this browser. Try Chrome or Edge.';
  micButton.setAttribute('aria-label', 'Speech input is not supported in this browser');
} else {
  recognition = new SpeechRecognition();
  recognition.lang = navigator.language || 'en-US';
  recognition.continuous = false;
  recognition.interimResults = true;

  micButton.addEventListener('click', () => {
    if (sendButton.disabled) return;
    if (isListening) {
      recognition.stop();
      return;
    }
    recognizedText = input.value.trim() ? `${input.value.trim()} ` : '';
    micButton.disabled = true;
    micButton.classList.add('listening');
    micButton.setAttribute('aria-label', 'Stop listening');
    speechStatus.textContent = 'Listening… speak your question.';
    try {
      recognition.start();
    } catch {
      micButton.disabled = false;
      micButton.classList.remove('listening');
      micButton.setAttribute('aria-label', 'Speak your question');
      speechStatus.textContent = 'Microphone could not start. Please try again.';
    }
  });

  recognition.onstart = () => {
    isListening = true;
    micButton.disabled = false;
  };

  recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const phrase = event.results[i][0].transcript;
      if (event.results[i].isFinal) recognizedText += `${phrase} `;
      else interim += phrase;
    }
    input.value = `${recognizedText}${interim}`.trimStart();
    input.dispatchEvent(new Event('input'));
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') speechStatus.textContent = 'I didn’t hear anything. Tap the microphone and try again.';
    else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') speechStatus.textContent = 'Please allow microphone access in your browser to use speech input.';
    else speechStatus.textContent = 'Speech input had a problem. Please try again.';
  };

  recognition.onend = () => {
    isListening = false;
    micButton.disabled = false;
    micButton.classList.remove('listening');
    micButton.setAttribute('aria-label', 'Speak your question');
    if (input.value.trim()) {
      speechStatus.textContent = 'I heard you. Getting an answer…';
      form.requestSubmit();
    } else if (speechStatus.textContent === 'Listening… speak your question.') {
      speechStatus.textContent = '';
    }
  };
}

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
  if (isListening) recognition.stop();
  messages.replaceChildren();
  addMessage('assistant', welcomeText, 'welcome-message');
  input.value = '';
  input.style.height = 'auto';
  setDog('welcome');
  speechStatus.textContent = '';
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
  micButton.disabled = true;
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
    micButton.disabled = !SpeechRecognition;
    speechStatus.textContent = '';
    input.focus();
  }
});
