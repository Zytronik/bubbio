import { useUserStore } from '@/stores/userStore';
import { MenuButton } from '../_interface/menuButton';
import { transitionPageAnimation } from '../animation/transitionPage';

export function isButtonDisabled(button: MenuButton): boolean {
  const userStore = useUserStore();
  if (!userStore.userSession.userDetails) {
    return false;
  }
  const currentUserID = userStore.userSession.userDetails.id;
  if (
    button.authIds &&
    (!currentUserID || !button.authIds.includes(currentUserID))
  ) {
    return true;
  }
  return false;
}

function handleMenuButtonClick(button: MenuButton) {
  transitionPageAnimation(button.page);
}

export function getMenuButtonAttributes(button: MenuButton) {
  return isButtonDisabled(button)
    ? {}
    : { onClick: () => handleMenuButtonClick(button) };
}
