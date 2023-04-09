// Refactor this if code is ever needed to be re-used
class ACExt {
  constructor() {
    this.runAt = new Date();
    this.appColor = '#00ffff';
    this.twitchColor = '#6441a5';

    this.claimButtonIntervalTime = 60000;
    this.chatNotificationIntervalTime = 10000;

    // chat notification variables
    this.audio = new Audio('../public/notification.mp3');
    this.titleDiv = document.querySelector('title');
    this.defaultTitleContent = this.titleDiv.innerText;
    this.username = null;
    this.mentionedMessages = {};

    this.#setUsername();
  }

  run() {
    this.#runClaimButtonPoll();
    this.#runChatNotification();

    this.#log(`script running at: ${new Date()}`);
  }

  #runClaimButtonPoll() {
    setInterval(() => {
      let twitchClaimButton = document.querySelector('[aria-label="Claim Bonus"]');
      if (twitchClaimButton) {
        twitchClaimButton.click();
        this.#log(`clicked claim button at: ${new Date()}`);
      }
    }, this.claimButtonIntervalTime);
  }

  // dependency - 7YV 
  #runChatNotification() {
    setInterval(() => {
      let chats = document.querySelectorAll('.chat-line__message');
      for (let i = 0; i < chats.length; i++) {
        let chat = chats[i];
        let id = chat.id;
        let fromUser = chat.dataset.aUser;
        let content = [...chat.querySelectorAll('[data-a-target="chat-message-text"]')];
        let text = content?.map(span => span.innerText);

        console.log(text)

        let textIncludesName = text?.includes(this.username)
        let notSeenBefore = !this.mentionedMessages[id]

        console.log('textIncludesName:', textIncludesName)
        console.log('notSeenBefore:', notSeenBefore)

        if (textIncludesName && notSeenBefore) {
          this.mentionedMessages[id] = true;
          this.audio.play();
          this.titleDiv.innerText = `❗ ${this.defaultTitleContent}`;
          this.#log(`You received a mention from: ${fromUser}`);
        } else {
          this.titleDiv.innerText = this.defaultTitleContent;
        }
      }

    }, this.chatNotificationIntervalTime);
  }

  // fetches username by clicking avatar and reading sidebar
  #setUsername() {
    document.querySelector('.tw-image-avatar').click();
    let username =  document.querySelector('[data-a-target="user-display-name"]');
    this.username = username.innerText;
    this.#log(`set username: ${this.username}`);
    document.querySelector('.tw-image-avatar').click();
  }

  #log(msg) {
    console.log(
      `%c[ACExt] %c[Twitch] %c${msg}`,
      `color: ${this.appColor};`,
      `color: ${this.twitchColor}`,
      'color: inherit;'
    );
  }
}

window.addEventListener('load', function () {
  const acext = new ACExt();
  acext.run();
});
