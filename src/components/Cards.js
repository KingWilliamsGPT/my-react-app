import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Avatar, Badge, Card, Text } from 'react-native-paper';
import { Fontisto } from '@expo/vector-icons';
import { useUserContext } from '../context/userContext';

export const ScrollViewCard = ({ title, imagePath }) => {
    return (
        <View style={{ marginRight: 20, width: 130, height: 225 }}>
            <Image source={{ uri: imagePath }} style={{ width: 130, height: 180, borderRadius: 10, marginBottom: 10, shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, shadowRadius: 3, }} />
            <Text style={{ fontSize: 11, color: 'black', }}>{title}</Text>
        </View>
    )
}

export const NotificationCard = ({ title, type, description, datetime, markOfRead }) => {
    const { user, i18n } = useUserContext();
    const adminAvatar = props => <Avatar.Image source={require('../../assets/images/avatar_image.png')} size={50} />
    const userAvatar = props => <Avatar.Image source={{ uri: `${user?.avatarUrl}` }} size={50} />
    return (
        <Card style={{ backgroundColor: 'white', marginBottom: 20, position: 'relative' }}>
            <Card.Title title={type} subtitle={Date(datetime)} left={type == "User" ? userAvatar : adminAvatar} titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: 18 }} subtitleStyle={{ fontSize: 14, color: '#9F9F9F' }} />
            {markOfRead && <Badge style={{ top: 15, right: 15, paddingHorizontal: 10, backgroundColor: '#FE7940', position: 'absolute' }}>{i18n.t('New')}</Badge>}
            <Card.Content>
                <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }} numberOfLines={1}>{title}</Text>
                <Text style={{ fontSize: 14, color: '#484848' }} numberOfLines={1}>{description}</Text>
            </Card.Content>
        </Card>
    )
}

export const ChurchCard = ({ title, imagePath, churchAddress }) => {
    return (
        <Card style={{ backgroundColor: 'white', marginBottom: 30 }}>
            <Card.Cover source={{ uri: `${imagePath}` }} style={{ height: 145, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
            <Card.Content style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: 'black', width: '60%' }}>{title}</Text>
                    <Text style={{ fontSize: 13, width: '40%', textAlign: 'right', color: 'black' }}><Fontisto name="map-marker-alt" size={14} color="#FF4A0E" style={{ marginRight: 8 }} /><Text>{churchAddress}</Text></Text>
                </View>
            </Card.Content>
        </Card>
    )
}