using CPFMS.Application.Entities.Base;

namespace CPFMS.Application.Entities.Master
{
	public class KothaMonthlyItems : BaseEntity
	{
		public Month Month { get; set; }
		public List<string> Items { get; set; }
	}
}
