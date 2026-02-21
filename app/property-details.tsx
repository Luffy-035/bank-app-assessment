import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const heroHeight = height * 0.72;

// Room status types
type RoomStatus = 'vacant' | 'occupied' | 'on-notice';

interface Tenant {
  name: string;
  gender: string;
  rentAmount: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  phoneNumber: string;
  meterStatus?: 'connected' | 'disconnected' | 'not_linked';
}

interface Room {
  number: string;
  type: string;
  status: RoomStatus;
  tenant?: Tenant;
}

interface Floor {
  name: string;
  rooms: Room[];
}

// Mock data for the property
const propertyData = {
  name: 'Wings Tower',
  location: 'Jakarta, Indonesia',
  rating: 4.9,
  type: 'Apartment',
  additionalImages: 3,
  floors: [
    {
      name: 'First Floor',
      rooms: [
        {
          number: '101', type: '1BHK', status: 'occupied' as RoomStatus,
          tenant: { name: 'Alice Johnson', gender: 'Female', rentAmount: '$1,200', paymentStatus: 'Paid', phoneNumber: '+62 812-3456-7890', meterStatus: 'connected' }
        },
        {
          number: '102', type: '1BHK', status: 'occupied' as RoomStatus,
          tenant: { name: 'Bob Smith', gender: 'Male', rentAmount: '$1,200', paymentStatus: 'Pending', phoneNumber: '+62 812-9876-5432', meterStatus: 'disconnected' }
        },
        { number: '103', type: '1RK', status: 'vacant' as RoomStatus },
        {
          number: '104', type: '1BHK', status: 'on-notice' as RoomStatus,
          tenant: { name: 'Charlie Davis', gender: 'Male', rentAmount: '$1,200', paymentStatus: 'Paid', phoneNumber: '+62 812-1111-2222', meterStatus: 'not_linked' }
        },
      ],
    },
    {
      name: 'Second Floor',
      rooms: [
        {
          number: '201', type: '1BHK', status: 'occupied' as RoomStatus,
          tenant: { name: 'Diana Prince', gender: 'Female', rentAmount: '$1,300', paymentStatus: 'Paid', phoneNumber: '+62 812-3333-4444', meterStatus: 'connected' }
        },
        { number: '202', type: '1BHK', status: 'vacant' as RoomStatus },
        {
          number: '203', type: '1RK', status: 'on-notice' as RoomStatus,
          tenant: { name: 'Evan Wright', gender: 'Male', rentAmount: '$900', paymentStatus: 'Overdue', phoneNumber: '+62 812-5555-6666', meterStatus: 'not_linked' }
        },
        { number: '204', type: '1BHK', status: 'vacant' as RoomStatus },
      ],
    },
  ] as Floor[],
};

const getOccupiedCount = (rooms: Room[]) => {
  return rooms.filter((r) => r.status === 'occupied').length;
};

const getRoomColor = (status: RoomStatus) => {
  switch (status) {
    case 'occupied':
      return '#22C55E';
    case 'on-notice':
      return '#EF4444';
    case 'vacant':
    default:
      return '#FFFFFF';
  }
};

const getRoomTextColor = (status: RoomStatus) => {
  return status === 'vacant' ? '#111827' : '#FFFFFF';
};

export default function PropertyDetailsScreen() {
  const params = useLocalSearchParams();
  const propertyName = (params.name as string) || propertyData.name;
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);

  // Add Tenant modal state
  const [addTenantRoom, setAddTenantRoom] = React.useState<Room | null>(null);
  const [tenantName, setTenantName] = React.useState('');
  const [tenantPhone, setTenantPhone] = React.useState('');
  const [generatedTenantId, setGeneratedTenantId] = React.useState<string | null>(null);

  const generateTenantId = () => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
    return `TEN-${yy}${mm}${dd}-${rand}`;
  };

  const handleRoomPress = (room: Room) => {
    if (room.status === 'vacant') {
      setAddTenantRoom(room);
      setTenantName('');
      setTenantPhone('');
      setGeneratedTenantId(null);
    } else {
      setSelectedRoom(room);
    }
  };

  const handleAddTenant = () => {
    if (!tenantName.trim()) return;
    const id = generateTenantId();
    setGeneratedTenantId(id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{propertyName}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImage}>
            {/* Back button overlay */}
            <TouchableOpacity style={styles.heroBackBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Thumbnail gallery on right */}
            <View style={styles.thumbnailGallery}>
              <View style={styles.thumbnail} />
              <View style={styles.thumbnail} />
              <View style={styles.thumbnail} />
            </View>

            {/* Bottom badges */}
            <View style={styles.heroBadges}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.ratingText}>{propertyData.rating}</Text>
                <View style={styles.ratingDivider} />
                <Text style={styles.ratingText}>8 Units</Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{propertyData.type}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyName}>{propertyData.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#22C55E" />
            <Text style={styles.locationText}>{propertyData.location}</Text>
          </View>
        </View>



        {/* Status Legend */}
        <View style={styles.statusLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, styles.legendVacant]} />
            <Text style={styles.legendLabel}>Vacant</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, styles.legendOccupied]}>
              <View style={styles.legendOccupiedInner} />
            </View>
            <Text style={styles.legendLabel}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, styles.legendOnNotice]}>
              <View style={styles.legendOnNoticeInner} />
            </View>
            <Text style={styles.legendLabel}>On Notice</Text>
          </View>
        </View>

        {/* Floor Sections */}
        {propertyData.floors.map((floor, index) => (
          <View key={index} style={styles.floorSection}>
            <View style={styles.floorHeader}>
              <Text style={styles.floorName}>{floor.name}</Text>
              <Text style={styles.floorOccupancy}>
                {getOccupiedCount(floor.rooms)}/{floor.rooms.length} Occupied
              </Text>
            </View>
            <View style={styles.roomsGrid}>
              {floor.rooms.map((room, roomIndex) => (
                <TouchableOpacity
                  key={roomIndex}
                  style={[
                    styles.roomCard,
                    { backgroundColor: getRoomColor(room.status) },
                    room.status === 'vacant' && styles.roomCardVacant,
                  ]}
                  onPress={() => handleRoomPress(room)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.roomNumber, { color: getRoomTextColor(room.status) }]}
                  >
                    {room.number}
                  </Text>
                  <Text
                    style={[styles.roomType, { color: getRoomTextColor(room.status) }]}
                  >
                    {room.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />

        {/* Collection */}
        <View style={styles.collectionBox}>
          <Text style={styles.collectionTitle}>Collection</Text>
          <View style={styles.collectionBarRow}>
            <View style={styles.barReceived} />
            <View style={styles.barPending} />
          </View>

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#22C55E' }]} /></View>
            <Text style={styles.collectionLabel}>Received</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.collectionVal, { color: '#22C55E' }]}>$18,000</Text>
          </View>

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#EF4444' }]} /></View>
            <Text style={styles.collectionLabel}>Pending</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.collectionVal, { color: '#EF4444' }]}>$2,000</Text>
          </View>

          <View style={styles.horizontalDottedLine} />

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap} />
            <Text style={styles.collectionLabel}>Total</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.collectionValMain}>$20,000</Text>
          </View>
        </View>

        {/* Tenant Payment Status Button */}
        <TouchableOpacity
          style={styles.tpStatusBtn}
          onPress={() => router.push('/tenant-payment-status')}
        >
          <View style={styles.tpStatusBtnContent}>
            <View style={styles.tpStatusIconWrap}>
              <Ionicons name="people-circle-outline" size={24} color="#1601AA" />
            </View>
            <Text style={styles.tpStatusText}>Tenant Payment Status</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={{ height: 140 }} />
      </ScrollView>



      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-dashboard')}>
          <Ionicons name="grid-outline" size={22} color="#9CA3AF" />
          <Text style={styles.tabText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/properties')}>
          <Ionicons name="business" size={22} color="#1601AA" />
          <Text style={[styles.tabText, styles.tabActive]}>Properties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-requests')}>
          <Ionicons name="construct-outline" size={22} color="#9CA3AF" />
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/help-support')}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#9CA3AF" />
          <Text style={styles.tabText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Tenant Details Modal (occupied/on-notice) */}
      {selectedRoom && selectedRoom.tenant && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Room {selectedRoom.number} Details</Text>
              <TouchableOpacity onPress={() => setSelectedRoom(null)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.modalRow}>
                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.modalIcon} />
                <View>
                  <Text style={styles.modalLabel}>Tenant Name</Text>
                  <Text style={styles.modalValue}>{selectedRoom.tenant.name}</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalRow}>
                <Ionicons name="male-female-outline" size={20} color="#6B7280" style={styles.modalIcon} />
                <View>
                  <Text style={styles.modalLabel}>Gender</Text>
                  <Text style={styles.modalValue}>{selectedRoom.tenant.gender}</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalRow}>
                <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.modalIcon} />
                <View>
                  <Text style={styles.modalLabel}>Phone Details</Text>
                  <Text style={styles.modalValue}>{selectedRoom.tenant.phoneNumber}</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalRow}>
                <Ionicons name="cash-outline" size={20} color="#6B7280" style={styles.modalIcon} />
                <View>
                  <Text style={styles.modalLabel}>Rent Amount</Text>
                  <Text style={styles.modalValue}>{selectedRoom.tenant.rentAmount}</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalRow}>
                <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.modalIcon} />
                <View>
                  <Text style={styles.modalLabel}>Payment Status</Text>
                  <View style={[
                    styles.paymentStatusBadge,
                    selectedRoom.tenant.paymentStatus === 'Paid' ? styles.statusPaid :
                      selectedRoom.tenant.paymentStatus === 'Pending' ? styles.statusPending : styles.statusOverdue
                  ]}>
                    <Text style={[
                      styles.paymentStatusText,
                      selectedRoom.tenant.paymentStatus === 'Paid' ? styles.textPaid :
                        selectedRoom.tenant.paymentStatus === 'Pending' ? styles.textPending : styles.textOverdue
                    ]}>{selectedRoom.tenant.paymentStatus}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalDivider} />

              {/* Smart Meter Section */}
              <View>
                <Text style={styles.meterHeader}>Smart Meter</Text>
                {selectedRoom.tenant.meterStatus === 'connected' ? (
                  <View>
                    <View style={[styles.meterStatusRow, styles.meterConnectedBg]}>
                      <Text style={styles.meterStatusText}>Connected</Text>
                      <View style={styles.meterIconBg}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    </View>
                    <Text style={styles.meterInfoText}>
                      Your room is linked with the meter which connects your active electricity consumption with the app and helps generate in smart bill generation
                    </Text>
                  </View>
                ) : selectedRoom.tenant.meterStatus === 'disconnected' ? (
                  <View>
                    <View style={[styles.meterStatusRow, styles.meterDisconnectedBg]}>
                      <Text style={styles.meterStatusText}>Disconnected</Text>
                      <View style={[styles.meterIconBg, { backgroundColor: '#FEF3C7' }]}>
                        <Ionicons name="warning" size={16} color="#D97706" />
                      </View>
                    </View>
                    <TouchableOpacity style={styles.meterReconnectBtn}>
                      <Text style={styles.meterReconnectText}>Reconnect Meter</Text>
                      <Ionicons name="refresh" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.meterConnectBtn}>
                    <Text style={styles.meterConnectText}>Connect with meter</Text>
                    <Ionicons name="chevron-forward" size={20} color="#111827" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Add Tenant Modal (vacant rooms) */}
      <Modal
        visible={!!addTenantRoom}
        animationType="slide"
        transparent
        onRequestClose={() => setAddTenantRoom(null)}
      >
        <View style={styles.atModalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => !generatedTenantId && setAddTenantRoom(null)} />
          <View style={styles.atModalSheet}>
            <View style={styles.atHandle} />

            {generatedTenantId ? (
              /* Success State */
              <View style={styles.atSuccess}>
                <View style={styles.atSuccessIcon}>
                  <Ionicons name="checkmark-circle" size={56} color="#22C55E" />
                </View>
                <Text style={styles.atSuccessTitle}>Tenant Added!</Text>
                <Text style={styles.atSuccessSubtitle}>Share this Tenant ID with the tenant to log in:</Text>
                <View style={styles.atIdBox}>
                  <Text style={styles.atIdText}>{generatedTenantId}</Text>
                </View>
                <Text style={styles.atIdNote}>The tenant uses this ID to log in and access their portal.</Text>
                <TouchableOpacity style={styles.atDoneBtn} onPress={() => setAddTenantRoom(null)}>
                  <Text style={styles.atDoneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Form State */
              <View style={styles.atForm}>
                <View style={styles.atHeader}>
                  <View>
                    <Text style={styles.atTitle}>Add Tenant</Text>
                    <Text style={styles.atSubtitle}>Room {addTenantRoom?.number} · {addTenantRoom?.type}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setAddTenantRoom(null)} style={styles.atClose}>
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.atLabel}>Tenant Name *</Text>
                <TextInput
                  style={styles.atInput}
                  placeholder="Full name"
                  placeholderTextColor="#9CA3AF"
                  value={tenantName}
                  onChangeText={setTenantName}
                />

                <Text style={styles.atLabel}>Phone Number</Text>
                <TextInput
                  style={styles.atInput}
                  placeholder="+91 XXXXX XXXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={tenantPhone}
                  onChangeText={setTenantPhone}
                />

                <Text style={styles.atNote}>
                  A unique Tenant ID will be generated. Share it with the tenant so they can log in.
                </Text>

                <TouchableOpacity
                  style={[styles.atSubmitBtn, !tenantName.trim() && styles.atSubmitBtnDisabled]}
                  onPress={handleAddTenant}
                  disabled={!tenantName.trim()}
                >
                  <Text style={styles.atSubmitText}>Generate Tenant ID</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },

  scroll: { flex: 1 },

  // Hero Section
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: heroHeight,
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailGallery: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -60 }],
    gap: 8,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  heroBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
  },
  ratingDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  typeBadge: {
    backgroundColor: '#3B3F8C',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FontFamily.lato,
  },

  // Property Info
  propertyInfo: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  propertyName: {
    fontSize: 22,
    fontFamily: FontFamily.interBold,
    color: '#111827',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },

  // Status Legend
  statusLegend: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 24,
  },
  legendItem: {
    alignItems: 'center',
    gap: 8,
  },
  legendIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendVacant: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  legendOccupied: {
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  legendOccupiedInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  legendOnNotice: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  legendOnNoticeInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },

  // Floor Section
  floorSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  floorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  floorName: {
    fontSize: 16,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
  },
  floorOccupancy: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
  },
  roomsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  roomCard: {
    width: (width - 32 - 36) / 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomCardVacant: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roomNumber: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    marginBottom: 2,
  },
  roomType: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1601AA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1601AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 24,
    paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 4 },
  tabActive: { color: '#1601AA', fontFamily: FontFamily.lato },

  // Collection
  collectionBox: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  collectionTitle: { fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 16 },
  collectionBarRow: {
    flexDirection: 'row',
    height: 16,
    marginBottom: 20,
    gap: 6,
  },
  barReceived: { flex: 0.9, backgroundColor: '#22C55E', borderRadius: 4 },
  barPending: { flex: 0.1, backgroundColor: '#EF4444', borderRadius: 4 },
  collectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dotWrap: { width: 24, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  collectionLabel: { fontSize: 13, fontFamily: FontFamily.lato, color: '#4B5563' },
  horizontalDottedLine: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 12,
    marginTop: 4,
    marginLeft: 32,
  },
  collectionVal: { fontSize: 13, fontFamily: FontFamily.interSemiBold },
  collectionValMain: { fontSize: 13, fontFamily: FontFamily.interBold, color: '#111827' },

  // Tenant Payment Status Button
  tpStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tpStatusBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tpStatusIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpStatusText: {
    fontSize: 15,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
  },

  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#111827',
  },
  modalContent: {
    gap: 12,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIcon: {
    width: 24,
  },
  modalLabel: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    marginBottom: 2,
  },
  modalValue: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 36,
  },
  paymentStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  statusPaid: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusOverdue: { backgroundColor: '#FEE2E2' },
  paymentStatusText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
  },
  textPaid: { color: '#16A34A' },
  textPending: { color: '#D97706' },
  textOverdue: { color: '#DC2626' },

  // Meter Styles
  meterHeader: {
    fontSize: 14,
    fontFamily: FontFamily.interBold,
    color: '#111827',
    marginBottom: 8,
    marginTop: 4,
  },
  meterConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  meterConnectText: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
  },
  meterStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  meterConnectedBg: {
    backgroundColor: '#ECFDF5', // Light green
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  meterDisconnectedBg: {
    backgroundColor: '#FEF2F2', // Light red
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  meterStatusText: {
    fontSize: 15,
    fontFamily: FontFamily.interBold,
    color: '#111827',
  },
  meterIconBg: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterInfoText: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    lineHeight: 18,
    marginHorizontal: 4,
  },
  meterReconnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1601AA',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    gap: 8,
  },
  meterReconnectText: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#FFFFFF',
  },

  // Add Tenant Modal (vacant rooms)
  atModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  atModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  atHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  // Form state
  atForm: { paddingBottom: 8 },
  atHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  atTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
  atSubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
  atClose: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  atLabel: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  atInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#111827',
  },
  atNote: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  atSubmitBtn: {
    backgroundColor: '#1601AA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  atSubmitBtnDisabled: { backgroundColor: '#A5B4FC' },
  atSubmitText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },

  // Success state
  atSuccess: { alignItems: 'center', paddingVertical: 16 },
  atSuccessIcon: { marginBottom: 12 },
  atSuccessTitle: {
    fontSize: 22,
    fontFamily: FontFamily.interBold,
    color: '#111827',
    marginBottom: 8,
  },
  atSuccessSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  atIdBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 12,
  },
  atIdText: {
    fontSize: 20,
    fontFamily: FontFamily.interBold,
    color: '#1601AA',
    letterSpacing: 1.5,
  },
  atIdNote: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  atDoneBtn: {
    backgroundColor: '#1601AA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  atDoneBtnText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
});