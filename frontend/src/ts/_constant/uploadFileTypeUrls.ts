import { UploadFileType } from '../_enum/uploadFileType';

export const UploadFileTypeUrls: Record<UploadFileType, string> = {
  [UploadFileType.ProfilePicture]: 'users/updateProfilePic',
  [UploadFileType.ProfileBanner]: 'users/updateProfileBanner',
};
