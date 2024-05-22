import { debounceTime, fromEvent, interval, merge, switchMap } from 'rxjs';

const mouseMove$ = fromEvent(document, 'mousemove');
const keyDown$ = fromEvent(document, 'keyDown');
const scroll$ = fromEvent(document, 'scroll');
const click$ = fromEvent(document, 'click');
const change$ = fromEvent(document, 'change');

const userActivity$ = merge(mouseMove$, keyDown$, scroll$, click$, change$);

const idle$ = userActivity$.pipe(
    debounceTime(60000 * 5),
    map(() => 'logout')
);

idle$.subscribe(() => {
    logout();
})

function logout() {
    console.log("Logging out as the user is inactive");
    fetch("<enter logout URL here>");
}

userActivity$.pipe(
    switchMap(() => timer(60000 * 5).pipe(map(() => 'logout')))
);