import ExcelJS, { type Column } from 'exceljs';
import { useToast } from 'primevue';
import { ref } from 'vue';

export const useExportExcel = () => {
  const isExporting = ref(false);
  const errorMessage = ref<string | null>(null);
  const toast = useToast();

  // Catatan: Parameter opsional (columns) dipindah ke paling belakang
  const exportToExcel = async <T extends Record<string, unknown>>(
    data: T[],
    fileName: string,
    columns?: Partial<Column>[]
  ) => {
    isExporting.value = true;
    errorMessage.value = null;

    // 1. Validasi: Jangan lanjutkan jika data kosong
    if (!data || data.length === 0) {
      console.warn('Export dibatalkan: Data kosong.');
      errorMessage.value = 'Data kosong.';
      toast.add({ severity: 'warn', summary: 'Peringatan', detail: 'Data kosong.', life: 3000 });
      isExporting.value = false;
      return false;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // 2. Ekstrak key secara dinamis jika kolom tidak disediakan
    let finalColumns = columns;
    if (!finalColumns) {
      // Menyapu seluruh data untuk mendapatkan semua key yang mungkin ada,
      // sehingga tidak ada properti yang terlewat meski data[0] tidak lengkap.
      const allKeys = Array.from(new Set(data.flatMap(Object.keys)));
      finalColumns = allKeys.map((key) => ({
        header: key,
        key
      })) as Partial<Column>[];
    }

    worksheet.columns = finalColumns;

    // 3. Tambahkan baris data
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // 4. Generate file dan unduh
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();

    // Pembersihan memori
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    isExporting.value = false;
    return true;
  };

  return {
    exportToExcel,
    isExporting,
    errorMessage
  };
};
