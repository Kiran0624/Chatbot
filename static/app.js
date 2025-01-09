class Chatbox {
    constructor() {
      this.args = {
        openButton: document.querySelector('.chatbox__button'),
        chatBox: document.querySelector('.chatbox__support'),
        sendButton: document.querySelector('.send__button')
      };
  
      this.state = false;
      this.messages = [];
    }
  
    display() {
      const { openButton, chatBox, sendButton } = this.args;
      openButton.addEventListener('click', () => this.toggleState(chatBox));
      sendButton.addEventListener('click', () => this.onSendButton(chatBox));
  
      const node = chatBox.querySelector('input');
      node.addEventListener('keyup', ({ key }) => {
        if (key === 'Enter') {
          this.onSendButton(chatBox);
        }
      });
    }
  
    toggleState(chatbox) {
      this.state = !this.state;
  
      // show or hide boxes
      if (this.state) {
        chatbox.classList.add('chatbox--active');
      } else {
        chatbox.classList.remove('chatbox--active');
      }
    }
  
    onSendButton(chatbox) {
      const textField = chatbox.querySelector('input');
      const text1 = textField.value;
      if (text1 === '') {
        return;
      }
  
      const msg1 = { name: 'User', message: text1 };
      this.messages.push(msg1);
  
      fetch($SCRIPT_ROOT + '/predict', {
        method: 'POST',
        body: JSON.stringify({ message: text1 }),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(r => r.json())
        .then(r => {
          const msg2 = { name: 'Bot', message: r.answer };
          this.messages.push(msg2);
          this.updateChatText(chatbox);
          textField.value = '';
        })
        .catch(error => {
          console.error('Error:', error);
          this.updateChatText(chatbox);
          textField.value = '';
        });
    }
  
    updateChatText(chatbox) {
      const html = this.messages
        .slice()
        .reverse()
        .map(item => {
          const messageType = item.name === 'Bot' ? 'visitor' : 'operator';
          return `<div class="messages__item messages__item--${messageType}">${item.message}</div>`;
        })
        .join('');
  
      const chatmessage = chatbox.querySelector('.chatbox__messages');
      chatmessage.innerHTML = html;
    }
  }
  
  const chatbox = new Chatbox();
  chatbox.display();
  