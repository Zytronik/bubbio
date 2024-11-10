import { useToastStore } from '@/stores/toastStore';
import { UploadFileType } from '../_enum/uploadFileType';
import { httpClient } from '../network/httpClient';
import { useSocketStore } from '@/stores/socketStore';
import { UploadFileTypeUrls } from './paths';

export async function uploadFile(
  file: File,
  fileType: UploadFileType,
): Promise<void> {
  const uploadUrl = UploadFileTypeUrls[fileType];
  const toastStore = useToastStore();
  const socketStore = useSocketStore();

  if (!uploadUrl) {
    toastStore.showMessage('Invalid upload type', 'error');
    throw new Error('Invalid upload type');
  }

  const formData = new FormData();
  formData.append(fileType, file);

  try {
    const response = await httpClient.post(uploadUrl, formData);

    if (!response.status.toString().startsWith('2')) {
      throw new Error(`Failed to upload file to ${uploadUrl}`);
    }
    socketStore.updateCurrentUser();
    toastStore.showMessage('File uploaded successfully!', 'success');
  } catch (error) {
    toastStore.showMessage('Error uploading file.', 'error');
    console.error('Error during file upload:', error);
    throw error;
  }
}
