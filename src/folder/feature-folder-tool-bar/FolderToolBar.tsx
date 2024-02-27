import styles from "./FolderToolBar.module.scss";
import classNames from "classnames/bind";
import { AddFolderButton } from "@/src/folder/ui-add-folder-button";
import { FolderButton } from "@/src/folder/ui-folder-button";
import { IconAndTextButton } from "@/src/sharing/ui-icon-and-text-button";
import { ALL_LINKS_TEXT, BUTTONS, KAKAO_SHARE_DATA, MODALS_ID } from "./constant";
import { ALL_LINKS_ID } from "@/src/link/data-access-link/constant";
import { KeyboardEvent, useState } from "react";
import { ShareModal } from "@/src/folder/ui-share-modal";
import { InputModal } from "@/src/sharing/ui-input-modal";
import { AlertModal } from "@/src/sharing/ui-alert-modal";
import { Folder, SelectedFolderId } from "@/src/folder/type";
import { ROUTE, copyToClipboard, useKakaoSdk } from "@/src/sharing/util";

const cx = classNames.bind(styles);

type FolderToolBarProps = {
  folders: Folder[];
  selectedFolderId?: SelectedFolderId;
};

export const FolderToolBar = ({ folders, selectedFolderId }: FolderToolBarProps) => {
  const { shareKakao } = useKakaoSdk();
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const folderName =
    ALL_LINKS_ID === selectedFolderId
      ? ALL_LINKS_TEXT
      : folders?.find(({ id }) => id === selectedFolderId)?.name ?? "";

  const getShareLink = () => `${window.location.origin}/shared?user=1&folder=${selectedFolderId}`;
  const closeModal = () => setCurrentModal(null);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };
  const handleKakaoClick = () => {
    shareKakao({ url: getShareLink(), ...KAKAO_SHARE_DATA });
  };
  const handleFacebookClick = () =>
    window?.open(`http://www.facebook.com/sharer.php?u=${getShareLink()}`);
  const handleLinkCopyClick = () => copyToClipboard(getShareLink());

  return (
    <div className={cx("container")}>
      <div className={cx("folders")}>
        <FolderButton
          key={ALL_LINKS_ID}
          text={ALL_LINKS_TEXT}
          href={ROUTE.폴더}
          isSelected={ALL_LINKS_ID === selectedFolderId}
        />
        {folders?.map(({ id, name }) => (
          <FolderButton
            key={id}
            text={name}
            href={`${ROUTE.폴더}/${id}`}
            isSelected={id === selectedFolderId}
          />
        ))}
      </div>
      <div className={cx("add-button")}>
        <AddFolderButton onClick={() => setCurrentModal(MODALS_ID.addFolder)} />
        <InputModal
          isOpen={currentModal === MODALS_ID.addFolder}
          title="폴더 추가"
          placeholder="내용 입력"
          buttonText="추가하기"
          onCloseClick={closeModal}
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </div>
      <h2 className={cx("folder-name")}>{folderName}</h2>
      {selectedFolderId !== ALL_LINKS_ID && (
        <div className={cx("buttons")}>
          {BUTTONS.map(({ text, iconSource, modalId }) => (
            <IconAndTextButton
              key={text}
              text={text}
              iconSource={iconSource}
              onClick={() => setCurrentModal(modalId)}
            />
          ))}
          <ShareModal
            isOpen={currentModal === MODALS_ID.share}
            folderName={folderName}
            onKakaoClick={handleKakaoClick}
            onFacebookClick={handleFacebookClick}
            onLinkCopyClick={handleLinkCopyClick}
            onCloseClick={closeModal}
            onKeyDown={handleKeyDown}
          />
          <InputModal
            isOpen={currentModal === MODALS_ID.rename}
            title="폴더 이름 변경"
            placeholder="내용 입력"
            buttonText="변경하기"
            onCloseClick={closeModal}
            onKeyDown={handleKeyDown}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <AlertModal
            isOpen={currentModal === MODALS_ID.delete}
            title="폴더 삭제"
            description={folderName}
            buttonText="삭제하기"
            onCloseClick={closeModal}
            onKeyDown={handleKeyDown}
            onClick={() => {}}
          />
        </div>
      )}
    </div>
  );
};