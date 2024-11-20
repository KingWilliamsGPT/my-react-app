import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex:1, 
        height:"100%", 
        alignItems: 'center', 
        justifyContent: 'center',
        width:'100%'
    },
    mainBackground: {
        flex:1,
        backgroundColor:'white',
        justifyContent:'center',
        width:'100%'
    },
    image: {
        flex:1,
        backgroundColor:'white',
        justifyContent:'center',
        width:'100%'
    },
    mainContinaer : {
        marginLeft:'auto',
        marginRight:'auto'
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
    authCard: {
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 20,
        width:360,
        marginVertical:20
    },
    tabButtonView: {
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: '#EAEAF5',
        borderRadius: 12,
        padding: 1,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginBottom: 20,
        backgroundColor:'white'
    },
    tabButton: {
        width: '50%',
        textAlign: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        height: 40,
    },
    tabButtonActive: {
        width: '50%',
        textAlign: 'center',
        backgroundColor: '#FE7940',
        borderRadius: 10,
        height: 40
    },
    inputBox: {
        backgroundColor: 'white',
        fontSize: 14,
        width: '100%',
        marginBottom: 20
    },

});