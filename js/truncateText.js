export default function truncate(input, chars) {
  if (input.length > chars) {
    return input.substring(0, chars) + "...";
  }
  return input;
}
