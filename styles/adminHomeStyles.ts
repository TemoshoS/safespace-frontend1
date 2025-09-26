import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#20C997',
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
  logoutText: { color: '#20C997', fontWeight: '600' },

  exportBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  exportText: { color: '#20C997', fontWeight: '600' },

  title: { fontSize: 24, marginVertical: 16, textAlign: 'center', fontWeight: 'bold' },

  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  expandedRow: { backgroundColor: '#e9fdf6' },
  cell: { paddingHorizontal: 8, justifyContent: 'center' },
  header: { backgroundColor: '#e0f7f1' },

  detailsBox: { backgroundColor: '#f1fdf9', padding: 10, paddingHorizontal: 16 },
  detail: { fontSize: 14, marginVertical: 2, color: '#333' },

  picker: { height: 40, width: '100%' },

  viewButton: {
    backgroundColor: '#20C997',
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
});
