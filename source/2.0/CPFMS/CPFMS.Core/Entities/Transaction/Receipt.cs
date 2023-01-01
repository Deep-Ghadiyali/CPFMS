using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Transaction
{
	public class Receipt : IdNarrationBaseEntity
	{
		public int ReceiptNo { get; set; }
		public DateOnly ReceiptDate { get; set; }
		public int DRAccountId { get; set; }
		public int DRSubAccountId { get; set; }
		public int CRAccountId { get; set; }
		public decimal TotalAmount { get; set; }
	}

	public class ReceiptDetails : IdNarrationBaseEntity
	{
		public int SerialNo { get; set; }
		public int CRSubAccountId { get; set; }
		public decimal Amount { get; set; }
	}
}
