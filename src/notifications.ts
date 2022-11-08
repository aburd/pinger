import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/api/notification';

async function wrapPermFn<F extends Function>(fn: F): Promise<void> {
  if (await isPermissionGranted()) {
    fn();
    return;
  }
  let permission = await requestPermission();
  switch (permission) {
    case "granted":
      fn();
      break;
    default:
      return;
  }
}

export async function notify(title: string, body: string) {
  wrapPermFn(() => {
    sendNotification({ title, body }); 
  });
}
