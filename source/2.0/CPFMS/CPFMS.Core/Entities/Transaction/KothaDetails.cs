using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Transaction
{
	public class KothaDetails : BaseEntity
	{
		public int AccountId { get; set; }
		public int SubAccountId { get; set; }
		public int MonthId { get; set; }
		public int Item1 { get; set; }
		public int Item2 { get; set; }
		public int Item3 { get; set; }
		public int Item4 { get; set; }
	}
}
