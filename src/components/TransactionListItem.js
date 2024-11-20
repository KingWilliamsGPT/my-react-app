import { Image, View, Text } from "react-native"
import { useUserContext } from "../context/userContext"

export const TransactionListItem = ({ churchName, amount, datetime, image }) => {
    const {i18n} = useUserContext();
    return (
        <View style={{ flexDirection: 'row', height: 75, borderTopWidth: 1, borderColor: '#DE8A68', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{uri:image}} style={{ width: 60, height: 60, marginRight: 20, borderRadius: 5 }} />
                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', width: 200, overflow: 'hidden' }} numberOfLines={1}>{churchName}</Text>
                    <Text style={{ fontSize: 12, color: '#A8A7A7' }}>{i18n.t('Donate Amount')} : <Text style={{ fontSize: 15, color: "black" }}>{amount}  F CFA</Text></Text>
                </View>
            </View>
            <Text style={{ fontSize: 12, color: "#A8A7A7" }}>{datetime}</Text>
        </View>
    )
}