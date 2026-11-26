/**
 * Smoothly scrolls to a section by ID while accounting for the sticky header
 * height, avoiding layout-shift interruptions when a mobile menu closes.
 */
export function scrollToSection(sectionId: string, delayMs = 0): void {
  const executeScroll = () => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 68;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });

    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  if (delayMs > 0) {
    window.setTimeout(executeScroll, delayMs);
  } else {
    executeScroll();
  }
}
