import { Modal, Button } from 'antd';

const { confirm } = Modal;

export default function ({content, onOk, onCancel}) {
    confirm({
        title: 'Are you sure?',
        content: content,
        okText: 'Save',
        okType: 'primary',
        cancelText: 'Cancel',
        onOk() {
            onOk()
        },
        onCancel() {
            onCancel()
        },
    });
};


