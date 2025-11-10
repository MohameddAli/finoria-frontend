/**
 * Keyboard Navigation Composable
 * Provides global keyboard shortcuts and navigation helpers
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardNav = () => {
  const shortcuts = ref<Map<string, KeyboardShortcut>>(new Map());
  const isEnabled = ref(true);

  /**
   * Register a keyboard shortcut
   */
  const registerShortcut = (id: string, shortcut: KeyboardShortcut): void => {
    shortcuts.value.set(id, shortcut);
  };

  /**
   * Unregister a keyboard shortcut
   */
  const unregisterShortcut = (id: string): void => {
    shortcuts.value.delete(id);
  };

  /**
   * Build shortcut key string
   */
  const buildShortcutKey = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push("ctrl");
    if (shortcut.alt) parts.push("alt");
    if (shortcut.shift) parts.push("shift");
    if (shortcut.meta) parts.push("meta");
    parts.push(shortcut.key.toLowerCase());
    return parts.join("+");
  };

  /**
   * Check if event matches shortcut
   */
  const matchesShortcut = (
    event: KeyboardEvent,
    shortcut: KeyboardShortcut
  ): boolean => {
    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrl &&
      !!event.altKey === !!shortcut.alt &&
      !!event.shiftKey === !!shortcut.shift &&
      !!event.metaKey === !!shortcut.meta
    );
  };

  /**
   * Handle keyboard event
   */
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!isEnabled.value) return;

    // Don't trigger shortcuts when user is typing in input/textarea
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      // Allow Escape to blur input
      if (event.key === "Escape") {
        target.blur();
      }
      return;
    }

    // Check all registered shortcuts
    for (const [id, shortcut] of shortcuts.value) {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  };

  /**
   * Enable shortcuts
   */
  const enable = (): void => {
    isEnabled.value = true;
  };

  /**
   * Disable shortcuts
   */
  const disable = (): void => {
    isEnabled.value = false;
  };

  /**
   * Setup keyboard event listener
   */
  onMounted(() => {
    if (import.meta.client) {
      window.addEventListener("keydown", handleKeyDown);
    }
  });

  /**
   * Cleanup
   */
  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener("keydown", handleKeyDown);
    }
  });

  /**
   * Get all registered shortcuts
   */
  const getAllShortcuts = (): KeyboardShortcut[] => {
    return Array.from(shortcuts.value.values());
  };

  return {
    registerShortcut,
    unregisterShortcut,
    enable,
    disable,
    isEnabled: readonly(isEnabled),
    getAllShortcuts,
    buildShortcutKey,
  };
};

/**
 * Global keyboard shortcuts
 */
export const useGlobalShortcuts = () => {
  const keyboardNav = useKeyboardNav();
  const appStore = useAppStore();
  const router = useRouter();

  onMounted(() => {
    // Ctrl/Cmd + K: Open search
    keyboardNav.registerShortcut("search", {
      key: "k",
      ctrl: true,
      description: "فتح البحث",
      action: () => {
        appStore.openSearch();
      },
    });

    // Ctrl/Cmd + B: Toggle sidebar
    keyboardNav.registerShortcut("sidebar", {
      key: "b",
      ctrl: true,
      description: "إظهار/إخفاء القائمة الجانبية",
      action: () => {
        appStore.toggleSidebar();
      },
    });

    // Ctrl/Cmd + /: Show keyboard shortcuts help
    keyboardNav.registerShortcut("help", {
      key: "/",
      ctrl: true,
      description: "عرض اختصارات لوحة المفاتيح",
      action: () => {
        // Log shortcuts (can be enhanced with a dialog later)
        console.log("Keyboard shortcuts:", keyboardNav.getAllShortcuts());
      },
    });

    // Escape: Close dialogs/modals
    keyboardNav.registerShortcut("escape", {
      key: "Escape",
      description: "إغلاق النوافذ المنبثقة",
      action: () => {
        // Generic escape handler - can be overridden in specific components
        window.dispatchEvent(new CustomEvent("escape-pressed"));
      },
    });

    // G then H: Go to home
    keyboardNav.registerShortcut("go-home", {
      key: "h",
      description: "الذهاب للصفحة الرئيسية",
      action: () => {
        router.push("/");
      },
    });

    // G then D: Go to dashboard
    keyboardNav.registerShortcut("go-dashboard", {
      key: "d",
      description: "الذهاب للوحة التحكم",
      action: () => {
        router.push("/dashboard");
      },
    });
  });

  return {
    ...keyboardNav,
  };
};

/**
 * Focus management utilities
 */
export const useFocusManagement = () => {
  /**
   * Focus first focusable element in container
   */
  const focusFirst = (container: HTMLElement): void => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }
  };

  /**
   * Focus last focusable element in container
   */
  const focusLast = (container: HTMLElement): void => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      (focusable[focusable.length - 1] as HTMLElement).focus();
    }
  };

  /**
   * Trap focus within container (for modals)
   */
  const trapFocus = (container: HTMLElement): (() => void) => {
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    if (focusable.length === 0) return () => {};

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (!firstFocusable || !lastFocusable) return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Focus first element if available
    firstFocusable?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  };

  /**
   * Return focus to previous element
   */
  const returnFocus = (previousElement: HTMLElement | null): void => {
    if (previousElement && document.body.contains(previousElement)) {
      previousElement.focus();
    }
  };

  /**
   * Get all focusable elements
   */
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  return {
    focusFirst,
    focusLast,
    trapFocus,
    returnFocus,
    getFocusableElements,
  };
};

/**
 * Skip navigation link (for accessibility)
 */
export const useSkipNav = () => {
  const skipToMain = (): void => {
    const main =
      document.querySelector("main") || document.querySelector('[role="main"]');
    if (main instanceof HTMLElement) {
      main.focus();
      main.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    skipToMain,
  };
};
