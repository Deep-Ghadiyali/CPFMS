using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Transaction
{
	public class JV : IdNarrationBaseEntity
	{
		public int JVNo { get; set; }
		public DateOnly JVDate { get; set; }
		public decimal TotalAmount { get; set; }
	}

	public class JVDetails : IdNarrationBaseEntity
	{
		public int SerialNo { get; set; }
		public int AccountId { get; set; }
		public int SubAccountId { get; set; }
		public decimal CRAmount { get; set; }
		public decimal DRAmount { get; set; }
	}
}
