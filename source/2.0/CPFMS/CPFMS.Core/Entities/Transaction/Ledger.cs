using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Transaction
{
	public class Ledger : IdNarrationBaseEntity
	{
		public int TransactionType { get; set; }
		public DateOnly TransactionDate { get; set; }
		public int AccountId { get; set; }
		public int SubAccountId { get; set; }
		public decimal CRAmount { get; set; }
		public int DRAmount { get; set; }
		public int CrossAccountId { get; set; }
	}
}
