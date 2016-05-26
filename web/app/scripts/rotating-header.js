export function rotateHeader() {
  const delay = 2500;
  const $words = $('.rotating-words span');
  const length = $words.length;
  let current = 0;

  function rotateWord() {
    const next = (current + 1 == length) ? 0 : current + 1;
    $words.removeClass('hiding');
    $words.removeClass('visible');
    $($words[current]).addClass('hiding');
    $($words[next]).addClass('visible');
    current = next;
    setTimeout(rotateWord, delay);
  }
  setTimeout(rotateWord, delay);
}
