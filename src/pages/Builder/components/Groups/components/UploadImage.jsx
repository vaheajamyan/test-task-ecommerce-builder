import React from 'react';
import { Upload, Button, message } from 'antd';
import { CameraFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { getBase64 } from '../../../../../utils/helper';

const UploadButton = styled(Button)`
  width: 40px;
  height: 40px;
`;

function checkFileType(file) {
  return (
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/svg'
  );
}

function UploadImage({ image, onAddImage }) {
  const onChange = async ({ fileList: newFileList }) => {
    const [file] = newFileList;

    const fileIsValid = checkFileType(file);

    if (file.status === 'error' || !fileIsValid) {
      return null;
    }

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    onAddImage(file);

    message.success('File uploaded successfully');
  };

  const uploadButton = (
    <UploadButton icon={<CameraFilled style={{ color: '#DDE0E7' }} />} />
  );

  function doNothing(subject) {
    subject.onSuccess();
  }

  function beforeUpload(file) {
    const fileIsValid = checkFileType(file);

    if (!fileIsValid) {
      message.error('You can only upload JPG/PNG/SVG file!');
    }

    return fileIsValid;
  }

  return (
    <>
      <Upload
        fileList={image ? [image] : []}
        beforeUpload={beforeUpload}
        onChange={onChange}
        multiple={false}
        customRequest={doNothing}
        itemRender={(_, file) => (
          <img src={file.preview} width="40" height="40" alt="Product Image" />
        )}>
        {!image && uploadButton}
      </Upload>
    </>
  );
}

export default UploadImage;
