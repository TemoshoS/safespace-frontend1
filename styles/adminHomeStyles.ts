import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  adminName: { color: '#424141ff', fontSize: 16, fontWeight: '600' },

  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  bell: { fontSize: 22, color: '#fff' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  logoutBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: { color: '#c7da30', fontWeight: '600' },

  exportBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  exportText: { color: '#c7da30', fontWeight: '600' },

  menuBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuDropdown: {
    marginTop: 60,
    marginRight: 16,
    backgroundColor: '#c7da30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#c7da30',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1001,
  },

  menuDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },


  title: { fontSize: 24, marginVertical: 16, textAlign: 'center', fontWeight: 'bold' },
  cardContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#c7da30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  
  cardEmail: { fontSize: 14, color: '#666', flex: 1 },
  
  cardDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#c7da30',
  },
 
  detail: { fontSize: 14, marginVertical: 2, color: '#333' },
  picker: {
    width: '100%',
    height: 40,
    color: '#000',
    fontSize: 16, // makes text fully visible
  },
  
  

  viewButton: {
    backgroundColor: '#c7da30',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  viewButtonText: { color: '#fff', fontWeight: '600' },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  modalImage: { width: '90%', height: '80%' },

  // Notifications modal
  notifModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  notifText: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 6,
    fontWeight: '500',
  },
  closeNotif: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  //dashboard styles

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
  },
  statCard: {
    width: "48%",
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#c7da30",
  },

  statText: {
    marginTop: 10,
    fontWeight: "600",

  },
  //mobile
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

justifyModalBox: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  width: '100%',
  maxWidth: 400,
  elevation: 10,
},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},

modalText: {
  fontSize: 14,
  marginBottom: 10,
},

modalLabel: {
  fontWeight: 'bold',
  marginBottom: 5,
},

textArea: {
  borderWidth: 1,
  borderColor: '#c7da30',
  borderRadius: 5,
  height: 100,
  padding: 10,
  textAlignVertical: 'top',
  marginBottom: 15,
},

modalBtnRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

modalBtn: {
  backgroundColor: '#c7da30',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 5,
},
 menu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#c7da30",
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  menuText: {
    fontSize: 18,
    color: "#333",
  },



});