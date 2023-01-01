using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Transaction
{
	public class Payment : IdNarrationBaseEntity
	{
		public DateOnly PaymentDate { get; set; }
		public int CRAccountId { get; set; }
		public int CRSubAccountId { get; set; }
		public int DRAccountId { get; set; }
		public string CheckNo { get; set; }
		public decimal TotalAmount { get; set; }
	}

	public class PaymentDetails : IdNarrationBaseEntity
	{
		public int SerialNo { get; set; }
		public int DRSubAccountId { get; set; }
		public decimal CattleFeed { get; set; }
		public decimal MineralMix { get; set; }
		public decimal PasuPosak { get; set; }
		public decimal Insurance { get; set; }
		public decimal Other { get; set; }
		public decimal Other1 { get; set; }
	}
}
