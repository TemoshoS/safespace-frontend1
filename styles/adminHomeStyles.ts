import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#c7da30',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  adminName: { color: '#fff', fontSize: 16, fontWeight: '600' },

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
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1001,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },


  title: { fontSize: 24, marginVertical: 16, textAlign: 'center', fontWeight: 'bold' },
  header: {
    backgroundColor: "#c7da30",
    paddingVertical: 10,
    color: "#fff",
  },


  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#dadada",
  },
  expandedRow: { backgroundColor: "#6c6c6c" },
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
    color: "black",
  },
  detailsBox: {
    backgroundColor: "#f1fdf9",
    padding: 10,
    paddingHorizontal: 16,
  },
  detail: { fontSize: 14, marginVertical: 2, color: "#333" },

  picker: {
    height: 40,
    width: "100%",
    color: "#000",
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

});