import { debounceTime, fromEvent, merge, switchMap } from "rxjs";

class idleLogout extends HTMLElement {
  constructor() {
    checkAndLogout();
  }

  logoutTime = 60000 * 5;
  logoutUrl = '';

  get logoutTime() {
    logoutTime = this.getAttribute('logout-time');
  }

  set logoutTime(value) {
    this.setAttribute('logout-time', value);
  }

  get logoutUrl() {
    logoutUrl = this.getAttribute('logout-url');
  }

  set logoutUrl(value) {
    this.setAttribute('logout-url', value);
  }

  checkAndLogout() {
    const mouseMove$ = fromEvent(document, "mousemove");
    const keyDown$ = fromEvent(document, "keyDown");
    const scroll$ = fromEvent(document, "scroll");
    const click$ = fromEvent(document, "click");
    const change$ = fromEvent(document, "change");

    const userActivity$ = merge(mouseMove$, keyDown$, scroll$, click$, change$);

    const idle$ = userActivity$.pipe(
      debounceTime(logoutTime),
      map(() => "logout")
    );

    idle$.subscribe(() => {
      logout();
    });

    function logout() {
      console.log("Inactivity detected, logging out session");
      //Full endpoint for logout
      fetch(logoutUrl);
    }

    userActivity$.pipe(
      switchMap(() => timer(logoutTime).pipe(map(() => "logout")))
    );
  }
}

customElements.define('idle-logout', idleLogout);
