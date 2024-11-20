import * as React from 'react';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { useUserContext } from '../context/userContext';

const Preloader = () => {
    const { isLoading } = useUserContext();
    const [visible, setVisible] = React.useState(isLoading);
    return (
        <Portal>
            <Modal visible={visible}  >
                <ActivityIndicator animating={true} color='#fe7940' size='large' />
            </Modal>
        </Portal>
    );
}

export default Preloader;