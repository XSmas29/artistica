<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <v-card-title class="d-flex align-center px-0">
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            Daftar Transaksi
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-row>
              <v-col
                cols="12"
                sm="6"
                class="pa-2"
              >
                <v-select
                  v-model="transactionListFilterUser.status_ids"
                  :loading="loadingTransactionStatusList"
                  :items="transactionStatusList"
                  multiple
                  item-title="status"
                  item-value="id"
                  label="Filter Status"
                  hide-details="auto"
                  chips
                  clearable
                  density="comfortable"
                  @update:model-value="debouncedLoadTransaction(true)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pa-2"
              >
                <v-select
                  v-model="transactionListSortUser"
                  :loading="loadingTransactionStatusList"
                  :items="transactionListSortOptions"
                  item-title="name"
                  item-value="id"
                  label="Urutkan Berdasarkan"
                  hide-details="auto"
                  density="comfortable"
                  prepend-inner-icon="mdi-sort"
                  return-object
                  @update:model-value="debouncedLoadTransaction(true)"
                >
                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :prepend-icon="item.props.value.icon"
                    />
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider />
      <v-data-table-server
        :loading="loadingTransactionList"
        :items="transactionList"
        :items-length="transactionCount"
        :headers="headerList"
        fixed-header
        multi-sort
        must-sort
        height="100%"
        class="layout"
        v-model:page="transactionListPaginationUser.page"
        v-model:items-per-page="transactionListPaginationUser.limit"
        @update:items-per-page="loadTransaction(true)"
        @update:page="loadTransaction(false)"
      >
        <template #[`item.no`]="{ index }">
          {{ ((transactionListPaginationUser.page - 1) * transactionListPaginationUser.limit) + index + 1 }}
        </template>
        <template #[`item.user`]="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="small"
              >
                <v-avatar
                  color="accent"
                >
                  <!-- <span class="text-body-1">{{ getInitials(item.customer_name) }}</span> -->
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <h3>{{ item.customer_name }}</h3>
                <p class="text-caption mt-1">
                  {{ item.customer_email }}
                </p>
                <p class="text-caption mt-1">
                  {{ item.customer_phone }}
                </p>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
        <template #[`item.total_price`]="{ item }">
          {{ formatCurrency(item.total_price) }}
        </template>
        <template #[`item.shipping_cost`]="{ item }">
          {{ formatCurrency(item.shipping_cost) }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ formatDateTime(item.created_at) }}
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip
            variant="tonal"
            class="text-uppercase"
            label
            :color="transactionStatusColor(item.status.id)"
          >
            {{ item.status.status }}
          </v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="text-end">
            <v-tooltip
              text="Lihat Detail Transaksi"
              location="top"
            >
              <template #activator="{ props }">
                <v-btn
                  icon
                  flat
                  density="comfortable"
                  v-bind="props"
                  @click="openTransactionDetail(item.id)"
                >
                  <v-icon
                    size="35"
                    color="secondary"
                  >
                    mdi-eye-circle
                  </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
        <template #bottom>
          <v-data-table-footer
            :items-per-page-options="[10, 25, 50]"
            :total-items="transactionCount"
            :page-text="
              (((transactionListPaginationUser.page - 1) * transactionListPaginationUser.limit) + 1) + '-' + 
                (transactionListPaginationUser.page * transactionListPaginationUser.limit > transactionCount
                  ? transactionCount
                  : transactionListPaginationUser.page * transactionListPaginationUser.limit
                )
                + ' dari ' + transactionCount
            "
          />
        </template>
      </v-data-table-server>
    </v-card>
  </xyztransition>
  <v-dialog
    v-model="dialogTransactionDetail"
    max-width="800"
  >
    <v-card
      
      :loading="loadingTransactionDetail"
    >
      <v-card-title>
        Detail Transaksi
      </v-card-title>
      <v-divider />
      <template v-if="!loadingTransactionDetail">
        <v-card-text class="pt-3">
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <div>
                <div class="d-flex text-subtitle-1">
                  <div
                    style="min-width: 175px"
                    class="flex-shrink-0"
                  >
                    Status Transaksi
                  </div>
                  <p class="px-2">
                    :
                  </p>
                  <p class="flex-shrink-1">
                    <v-chip
                      variant="tonal"
                      class="text-uppercase"
                      label
                      :color="transactionStatusColor(transactionDetail.status.id)"
                    >
                      {{ transactionDetail.status.status }}
                    </v-chip>
                  </p>
                </div>
                <div class="d-flex text-subtitle-1">
                  <div
                    style="min-width: 175px"
                    class="flex-shrink-0"
                  >
                    Tanggal Pembelian
                  </div>
                  <p class="px-2">
                    :
                  </p>
                  <p class="flex-shrink-1">
                    {{ formatDateTime(transactionDetail.created_at) }}
                  </p>
                </div>
              </div>
              <v-divider class="my-2" />
              <div>
                <p class="text-subtitle-1 mb-1 font-weight-medium">
                  Detail Produk
                </p>
                <template
                  :key="item.id"
                  v-for="item in transactionDetail.details"
                >
                  <v-card
                    variant="tonal"
                    class="mb-2"
                  >
                    <div class="d-flex pa-3">
                      <div>
                        <v-img
                          :src="item.variant.image ? item.variant.image.path : item.variant.product.images[0] ? item.variant.product.images[0].path : productPlaceholder"
                          :lazy-src="productPlaceholder"
                          width="80"
                          class="rounded me-3"
                        />
                      </div>
                      <div class="align-self-center">
                        <p class="text-subtitle-1">
                          {{ item.variant.product.name }}
                        </p>
                        <p class="text-caption font-weight-light">
                          {{ item.quantity }} X {{ formatCurrency(item.price) }}
                        </p>
                      </div>
                      <div class="ms-auto align-self-center">
                        <p class="text-subtitle-1 text-end font-weight-medium">
                          Subtotal
                        </p>
                        <p class="text-body-2">
                          {{ formatCurrency(item.quantity * item.price) }}
                        </p>
                      </div>
                    </div>
                  </v-card>
                </template>
              </div>
              <v-divider class="my-2" />
              <div>
                <p class="text-subtitle-1 mb-1 font-weight-medium">
                  Detail Pengiriman
                </p>
                <v-card
                  variant="tonal"
                  class="pa-3"
                >
                  <div class="d-flex">
                    <div
                      style="min-width: 135px"
                      class="flex-shrink-0"
                    >
                      Kurir
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1">
                      {{ transactionDetail.shipping_service }}
                    </p>
                  </div>
                  <div class="d-flex">
                    <div
                      style="min-width: 135px"
                      class="flex-shrink-0"
                    >
                      Alamat
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1">
                      {{ transactionDetail.shipping_address }}, {{ transactionDetail.shipping_city }}, {{ transactionDetail.shipping_postal_code }}
                    </p>
                  </div>
                  <div class="d-flex">
                    <div
                      style="min-width: 135px"
                      class="flex-shrink-0"
                    >
                      Biaya Pengiriman
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1">
                      {{ formatCurrency(transactionDetail.shipping_cost) }}
                    </p>
                  </div>
                </v-card>
              </div>
              <v-divider class="my-2" />
              <div>
                <p class="text-subtitle-1 mb-1 font-weight-medium">
                  Detail Pembayaran
                </p>
                <v-card
                  variant="tonal"
                  class="pa-3"
                >
                  <div class="d-flex">
                    <div
                      style="min-width: 155px"
                      class="flex-shrink-0"
                    >
                      Metode Pembayaran
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1">
                      {{ transactionDetail.payment_method }}
                    </p>
                  </div>
                  <div class="d-flex">
                    <div
                      style="min-width: 155px"
                      class="flex-shrink-0"
                    >
                      Total Harga Barang
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1">
                      {{ formatCurrency(transactionDetail.total_price) }}
                    </p>
                  </div>
                  <div class="d-flex">
                    <div
                      style="min-width: 155px"
                      class="flex-shrink-0"
                    >
                      Biaya Pengiriman
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1">
                      {{ formatCurrency(transactionDetail.shipping_cost) }}
                    </p>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex">
                    <div
                      style="min-width: 155px"
                      class="flex-shrink-0 font-weight-medium"
                    >
                      Total Belanja
                    </div>
                    <p class="px-2">
                      :
                    </p>
                    <p class="flex-shrink-1 font-weight-medium">
                      {{ formatCurrency(transactionDetail.shipping_cost + transactionDetail.total_price) }}
                    </p>
                  </div>
                </v-card>
              </div>
            </v-col>
            <v-divider vertical />
            <v-col
              cols="12"
              md="4"
              class="pe-0"
            >
              <div>
                <!-- jika status pesanan adalah 'Menunggu Pembayaran' -->
                <v-btn
                  block
                  variant="flat"
                  color="grey"
                  disabled
                  v-if="transactionDetail.status.id === 2"
                >
                  Pesanan Sedang Diproses
                </v-btn>
                <template v-else-if="transactionDetail.status.id === 3">
                  <v-btn
                    block
                    variant="flat"
                    color="success"
                    @click="confirmOrderArrived"
                  >
                    Pesanan Sudah Sampai
                  </v-btn>
                  <div
                    class="text-caption mt-1"
                  >
                    <v-icon class="me-1">
                      mdi-information
                    </v-icon>
                    <span>Klik tombol diatas jika pesanan sudah sampai</span>
                  </div>
                </template>
                <template v-else-if="transactionDetail.status.id === 4">
                  <v-btn
                    block
                    variant="flat"
                    color="success"
                  >
                    <!-- @click="confirmOrderFinished" -->
                    Selesaikan Pesanan
                  </v-btn>
                  <div
                    class="text-caption mt-1"
                  >
                    <v-icon class="me-1">
                      mdi-information
                    </v-icon>
                    <span>Klik tombol diatas jika tidak ada masalah pada pesanan anda</span>
                  </div>
                </template>
                <v-btn
                  block
                  variant="flat"
                  color="grey"
                  disabled
                  size="small"
                  v-else-if="transactionDetail.status.id === 5"
                >
                  Menunggu Komplain Selesai
                </v-btn>
                <v-btn
                  block
                  variant="flat"
                  color="grey"
                  disabled
                  v-else-if="transactionDetail.status.id === 6"
                >
                  Pesanan Sudah Selesai
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text="Close"
          color="error"
          variant="tonal"
          @click="dialogTransactionDetail = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogConfirmOrderArrived"
    max-width="400"
  >
    <v-card>
      <v-card-title>
        Konfirmasi Pesanan Sampai
      </v-card-title>
      <v-card-text>
        Apakah Anda yakin ingin mengubah status pesanan ini menjadi sudah sampai?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          @click="dialogConfirmOrderArrived = false"
        >
          Tidak
        </v-btn>
        <v-btn
          color="success"
          @click="confirmYesOrderArrived"
          :loading="loadingEditTransactionStatus"
        >
          Ya
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/store/modules'
import useTransaction from '@composables/useTransaction'
import { onMounted, ref } from 'vue'
import { formatCurrency, formatDateTime, transactionStatusColor, productPlaceholder } from '@helpers/utils'
import { useDebounceFn } from '@vueuse/core'

export default {
	setup() {
		const { 
			getTransactionStatusList, loadingTransactionStatusList, transactionStatusList,
			getTransactionList, loadingTransactionList, transactionList, transactionCount,
			getTransactionDetail, loadingTransactionDetail, transactionDetail,
			editTransactionStatus, loadingEditTransactionStatus,
		} = useTransaction()
    
		const { transactionListFilterUser, transactionListSortUser, transactionListPaginationUser, transactionListSortOptions } = storeToRefs(useTransactionStore())
    
		onMounted(() => {
			getTransactionStatusList()
			loadTransaction(true)
		})

		const debouncedLoadTransaction = useDebounceFn((resetPage: boolean) => {
			loadTransaction(resetPage)
		}, 500)

		const headerList = ref([
			{
				text: 'No',
				value: 'no',
				title: 'No',
			},
			{
				text: 'ID',
				value: 'id',
				title: 'ID',
			},
			{
				text: 'Total Pembelian',
				value: 'total_price',
				title: 'Total Pembelian',
			},
			{
				text: 'Ongkos Kirim',
				value: 'shipping_cost',
				title: 'Ongkos Kirim',
			},
			{
				text: 'Tanggal Pembelian',
				value: 'created_at',
				title: 'Tanggal Pembelian',
			},
			{
				text: 'Status',
				value: 'status',
				title: 'Status',
			},
			{
				text: 'Aksi',
				value: 'action',
				title: 'Aksi',
			},
		])

		const loadTransaction = async (resetPage: boolean) => {
			if (resetPage) transactionListPaginationUser.value.page = 1
			await getTransactionList(transactionListFilterUser.value, transactionListSortUser.value, transactionListPaginationUser.value)
		}

		const dialogTransactionDetail = ref(false)

		const openTransactionDetail = (id: string) => {
			dialogTransactionDetail.value = true
			getTransactionDetail(id)
		}

		const dialogConfirmOrderArrived = ref(false)

		const confirmOrderArrived = () => {
			dialogConfirmOrderArrived.value = true
		}

		const confirmYesOrderArrived = async () => {
			// 4 = sudah sampai
			await editTransactionStatus(transactionDetail.value.id, 4)
			dialogConfirmOrderArrived.value = false
			dialogTransactionDetail.value = false
			loadTransaction(true)
		}

		return {
			formatCurrency,
			formatDateTime,
			transactionStatusColor,
			debouncedLoadTransaction,
			openTransactionDetail,
			productPlaceholder,

			headerList,
      
			transactionListFilterUser,
			transactionListSortUser,
			transactionListPaginationUser,
			transactionListSortOptions,

			loadingTransactionStatusList,
			transactionStatusList,

			loadTransaction,
			loadingTransactionList,
			transactionList,
			transactionCount,

			loadingTransactionDetail,
			transactionDetail,
			dialogTransactionDetail,

			confirmOrderArrived,
			dialogConfirmOrderArrived,
			confirmYesOrderArrived,
			loadingEditTransactionStatus,
		}
	}
}
</script>